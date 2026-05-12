import OpenAI from 'openai';
import { db, admin } from '../firebaseAdmin.js';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

// Get user's generations
export const getUserGenerations = async (req, res) => {
  try {
    const { uid } = req.params;

    console.log('🔍 API called: GET /api/generations/:uid with uid:', uid);

    if (!uid) {
      console.log('❌ Error: User ID is missing');
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    console.log('📥 Fetching latest generation for user:', uid);

    // Get the most recent generation for this user from sub-collection
    const generationsRef = db.collection('users').doc(uid).collection('generations')
      .orderBy('createdAt', 'desc')
      .limit(1);

    console.log('🔥 Firestore query created, executing...');
    const snapshot = await generationsRef.get();
    console.log('📊 Firestore query completed, docs found:', snapshot.docs.length);

    if (snapshot.empty) {
      console.log('✅ No generations found for user:', uid, '- returning empty array');
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    console.log('📦 Found generations, processing latest one...');
    const latestGeneration = snapshot.docs[0];
    const generationData = {
      id: latestGeneration.id,
      ...latestGeneration.data(),
      createdAt: latestGeneration.data().createdAt?.toDate()
    };

    console.log('📋 Raw generation data:', {
      id: generationData.id,
      brandDNA: generationData.brandDNA ? 'exists' : 'missing',
      logoUrls: generationData.logoUrls?.length || 0,
      createdAt: generationData.createdAt
    });

    // Transform the data to match the frontend expected format
    const formattedData = {
      brandName: generationData.brandDNA?.brandName || 'Brand',
      vibe: generationData.brandDNA?.vibe || 'Modern',
      colorPalette: generationData.brandDNA?.colorPalette || ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],

      logos: (generationData.logoUrls || []).map((imageUrl, index) => {
        const styles = ['Icon', 'Wordmark', 'Abstract', 'Modern'];
        return {
          id: index,
          style: styles[index] || 'Logo',
          imageUrl: imageUrl,
          prompt: generationData.brandDNA?.imagePrompts?.[index] || 'Logo design',
          description: `${styles[index] || 'Logo'} design for ${generationData.brandDNA?.brandName || 'Brand'}`
        };
      }),
      generationId: generationData.id,
      createdAt: generationData.createdAt
    };

    console.log('🎯 Formatted data for frontend:', {
      brandName: formattedData.brandName,
      logosCount: formattedData.logos.length,
      hasLogos: formattedData.logos.some(logo => logo.imageUrl),
      generationId: formattedData.generationId
    });

    return res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('💥 CRITICAL ERROR in getUserGenerations:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details
    });

    // Return empty array instead of 500 error for any Firestore issues
    console.log('🔄 Returning empty array due to error');
    return res.status(200).json({
      success: true,
      data: []
    });
  }
};

// Handler wrapper for server.js import
export const getUserGenerationsHandler = getUserGenerations;

// Get user's unlocks
export const getUserUnlocks = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('🔓 API called: GET /api/unlocks/:userId with userId:', userId);

    if (!userId) {
      console.log('❌ Error: User ID is missing');
      return res.status(200).json({
        success: true,
        unlocks: []
      });
    }

    console.log('📥 Fetching unlocks for user:', userId);

    // Get all unlocks for this user
    const unlocksRef = db.collection('users').doc(userId).collection('unlocks');
    const snapshot = await unlocksRef.get();
    console.log('📊 Firestore query completed, unlocks found:', snapshot.docs.length);

    if (snapshot.empty) {
      console.log('✅ No unlocks found for user:', userId, '- returning empty array');
      return res.status(200).json({
        success: true,
        unlocks: []
      });
    }

    console.log('📦 Found unlocks, processing data...');
    const unlocks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        generationId: data.generationId,
        logoIndex: data.logoIndex,
        tier: data.tier,
        cost: data.cost,
        unlockedAt: data.unlockedAt?.toDate()
      };
    });

    console.log('🎯 Returning unlocks:', {
      count: unlocks.length,
      generationIds: [...new Set(unlocks.map(u => u.generationId))],
      logoIndices: unlocks.map(u => u.logoIndex)
    });

    return res.status(200).json({
      success: true,
      unlocks
    });

  } catch (error) {
    console.error('💥 CRITICAL ERROR in getUserUnlocks:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details
    });

    // Return empty array instead of 500 error for any Firestore issues
    console.log('🔄 Returning empty array due to error');
    return res.status(200).json({
      success: true,
      unlocks: []
    });
  }
};

// Handler wrapper for server.js import
export const getUserUnlocksHandler = getUserUnlocks;

// Generate brand DNA and logos using OpenAI GPT-4o and DALL-E 3
// Unlock logo endpoint with Exclusive Plan Vectorization
export const unlockLogo = async (req, res) => {
  try {
    const { generationId, logoIndex, selectedTier } = req.body;
    const userId = req.user?.uid;

    console.log('🔐 Unlock logo request:', { generationId, logoIndex, selectedTier, userId });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!generationId || logoIndex === undefined || !selectedTier) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: generationId, logoIndex, selectedTier'
      });
    }

    // PRICING LOGIC FIRST - Determine cost based on tier (case-insensitive)
    const tier = selectedTier;
    console.log("Processing tier:", tier);

    const cost = tier.toLowerCase() === 'exclusive' ? 35 : (tier.toLowerCase() === 'premium' ? 20 : 10);
    console.log("Calculated cost:", cost);

    if (!tier || (tier.toLowerCase() !== 'exclusive' && tier.toLowerCase() !== 'premium' && tier.toLowerCase() !== 'standard')) {
      console.log('❌ Invalid tier selected:', tier);
      return res.status(400).json({
        success: false,
        message: 'Invalid tier selected'
      });
    }

    // Check user's current OPPAL balance
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    const currentBalance = userData.credits || 0;

    console.log('📊 Current balance:', currentBalance, 'Required:', cost);

    if (currentBalance < cost) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient OPPAL balance',
        required: cost,
        current: currentBalance
      });
    }

    // Check if already unlocked to prevent double charging
    const unlockId = `${generationId}_${logoIndex}`;
    const existingUnlock = await db.collection('users').doc(userId)
      .collection('unlocks').doc(unlockId).get();

    if (existingUnlock.exists) {
      return res.status(400).json({
        success: false,
        message: 'Logo already unlocked'
      });
    }

    console.log('💳 Deducting', cost, 'OPPAL from user balance for tier:', selectedTier);

    // Deduct credits from user balance
    await db.collection('users').doc(userId).update({
      credits: admin.firestore.FieldValue.increment(-cost),
      lastUnlockedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Get the generation data to access the logo URL
    const generationDoc = await db.collection('users').doc(userId)
      .collection('generations').doc(generationId).get();

    if (!generationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Generation not found'
      });
    }

    const generationData = generationDoc.data();
    const logoUrls = generationData.logoUrls || [];

    if (logoIndex >= logoUrls.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid logo index'
      });
    }

    const originalImageUrl = logoUrls[logoIndex];

    // Create unlock record
    const unlockData = {
      generationId,
      logoIndex,
      tier: selectedTier,
      cost,
      unlockedAt: admin.firestore.FieldValue.serverTimestamp(),
      originalImageUrl
    };

    // EXCLUSIVE PLAN: Trigger vectorization BEFORE saving to database
    if (selectedTier.toLowerCase() === 'exclusive') {
      console.log('🚀 VECTORIZATION STARTING FOR SESSION:', generationId);

      let svgUrl = null;

      try {
        // 1. Fetch the image as a Blob using native fetch
        const imageRes = await fetch(originalImageUrl);
        if (!imageRes.ok) throw new Error('Cloudinary image fetch failed');
        const imageBlob = await imageRes.blob();

        // 2. Use NATIVE FormData (Do NOT import from 'form-data')
        const formData = new FormData();
        formData.append('image', imageBlob, 'logo.jpg');

        // 3. Prepare Auth
        const authString = Buffer.from(`${process.env.API_ID}:${process.env.API_SECRET}`).toString('base64');

        // 4. Send request using NATIVE fetch
        const response = await fetch('https://vectorizer.ai/api/v1/vectorize?mode=test&out.svg.simplify=true', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authString}`
            // Do NOT set Content-Type header manually, fetch will do it with the correct boundary
          },
          body: formData
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(`Vectorizer API Error: ${response.status} - ${errorMsg}`);
        }

        // 1. Get the result as an arrayBuffer
        const arrayBuffer = await response.arrayBuffer();
        const vectorizedBuffer = Buffer.from(arrayBuffer);

        // 2. CHECK: Agar response XML/SVG hai (Test mode mein yahi hota hai)
        const firstFewChars = vectorizedBuffer.toString('utf8', 0, 50);
        let cloudinaryResponse;

        if (firstFewChars.includes('<?xml') || firstFewChars.includes('<svg')) {
          console.log("✅ Received SVG/XML data. Saving as SVG...");

          const svgSizeBytes = vectorizedBuffer.length;

          // Validate SVG size (must be under 5MB)
          const maxSizeBytes = 5 * 1024 * 1024; // 5MB
          if (svgSizeBytes > maxSizeBytes) {
            throw new Error(`SVG size (${svgSizeBytes} bytes) exceeds 5MB limit`);
          }

          // Upload SVG to Cloudinary
          console.log('☁️ Uploading SVG to Cloudinary...');
          try {
            cloudinaryResponse = await cloudinary.uploader.upload(`data:image/svg+xml;base64,${vectorizedBuffer.toString('base64')}`, {
              folder: '1dollarlogo/vectorized-logos',
              public_id: `vectorized_${userId}_${generationId}_${logoIndex}`,
              resource_type: 'raw', // <--- YE SABSE ZAROORI HAI (SVG ko raw treat karna parta hai)
              format: 'svg'        // <--- Force extension to SVG
            });
            console.log('✅ Cloudinary upload successful:', cloudinaryResponse.secure_url);
          } catch (uploadError) {
            console.error('❌ Cloudinary upload failed:', uploadError);

            // Check if size is the issue
            if (uploadError.message && uploadError.message.includes('size') ||
              uploadError.message && uploadError.message.includes('limit') ||
              uploadError.message && uploadError.message.includes('too large')) {
              console.error('🔍 Size issue detected - SVG size:', svgSizeBytes, 'bytes');
              throw new Error(`SVG file size (${svgSizeBytes} bytes) is too large for upload. Maximum allowed is 5MB.`);
            } else {
              console.error('🔍 Other upload error:', uploadError.message);
              throw new Error(`Failed to upload SVG to Cloudinary: ${uploadError.message}`);
            }
          }
        } else {
          // Agar JSON error aata hai toh yahan handle karein
          console.log("Received other format.");
          const responseText = vectorizedBuffer.toString('utf8');
          console.log("Response preview:", responseText.substring(0, 200));
          throw new Error(`Unexpected response format. Expected SVG/XML but received: ${responseText.substring(0, 100)}...`);
        }

        svgUrl = cloudinaryResponse.secure_url;
        console.log('🔗 SVG URL generated:', svgUrl);

        // Add SVG URL to unlock data BEFORE saving to database
        unlockData.svgUrl = svgUrl;
        unlockData.vectorizationStatus = 'completed';
        unlockData.vectorizedAt = admin.firestore.FieldValue.serverTimestamp();

        console.log('✅ Vectorization completed successfully - saving to database with SVG URL');

      } catch (error) {
        console.error("Vectorization Failed:", error.message);

        try {
          // Refund full 35 OPPAL for Exclusive tier
          await db.collection('users').doc(userId).update({
            credits: admin.firestore.FieldValue.increment(35)
          });

          console.log('💸 Refunded full 35 OPPAL due to vectorization failure');

          return res.status(500).json({
            success: false,
            message: 'Vectorization failed for Exclusive tier. Credits refunded.',
            error: error.message,
            creditsRefunded: 35
          });

        } catch (refundError) {
          console.error('❌ Credit refund failed:', refundError);

          return res.status(500).json({
            success: false,
            message: 'Vectorization failed and credit refund failed. Please contact support.',
            error: error.message
          });
        }
      }
    }

    // STRICT AWAIT: Save unlock record AFTER vectorization is complete
    console.log('💾 Saving unlock record to database...');
    await db.collection('users').doc(userId)
      .collection('unlocks').doc(unlockId).set(unlockData);
    console.log('✅ Unlock record saved to database with svgUrl:', !!unlockData.svgUrl);

    // FINAL CHECK: For Exclusive tier, ensure svgUrl is available before sending response
    if (selectedTier.toLowerCase() === 'exclusive') {
      console.log("Vectorization result:", unlockData.svgUrl);

      if (!unlockData.svgUrl) {
        console.error('❌ SVG URL missing for Exclusive tier - not sending response yet');
        return res.status(500).json({
          success: false,
          message: 'Vectorization failed to complete properly - no SVG URL available'
        });
      }
    }

    console.log('✅ Logo unlocked successfully - sending response with svgUrl:', !!unlockData.svgUrl);

    return res.status(200).json({
      success: true,
      message: selectedTier.toLowerCase() === 'exclusive' && unlockData.svgUrl
        ? 'Exclusive logo unlocked with vectorization'
        : 'Logo unlocked successfully',
      data: {
        tier: selectedTier,
        cost: unlockData.cost || cost,
        remainingBalance: currentBalance - (unlockData.cost || cost),
        svgUrl: unlockData.svgUrl || null,
        vectorizationStatus: unlockData.vectorizationStatus || 'not_applicable'
      }
    });

  } catch (error) {
    console.error('❌ Error unlocking logo:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unlock logo'
    });
  }
};

export const generateBrandStrategy = async (req, res) => {
  try {
    const {

      brandName,
      businessType,
      selectedProducts,
      selectedColors,
      brandStyle,
      usageLocations,
      colorsToAvoid,
      symbolsToInclude,
      symbolsToAvoid,
      selectedPlatforms,
      contactInfo,
      headshot,
      flyer,
      merch
    } = req.body;
    const userId = req.user?.uid;



    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY?.trim(),
    });

    // Verify API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const brandContext = `
Brand Name: ${brandName || 'Not specified'}
Business Type: ${businessType || 'Not specified'}
Products/Services: ${selectedProducts?.join(', ') || 'Logo'}
Brand Style: ${brandStyle?.join(', ') || 'Modern'}
Usage Locations: ${usageLocations?.join(', ') || 'Digital'}
Symbols to Include: ${symbolsToInclude || 'Not specified'}
Symbols to Avoid: ${symbolsToAvoid || 'None specified'}
Colors to Avoid: ${colorsToAvoid || 'None specified'}
${selectedPlatforms?.length ? `Social Platforms: ${selectedPlatforms.join(', ')}` : ''}
${contactInfo?.name ? `Contact: ${contactInfo.name}${contactInfo.title ? ', ' + contactInfo.title : ''}` : ''}
${contactInfo?.website ? `Website: ${contactInfo.website}` : ''}
${headshot?.photoUse ? `Headshot Use: ${headshot.photoUse}` : ''}
${headshot?.background ? `Headshot Background: ${headshot.background}` : ''}
${headshot?.style ? `Headshot Style: ${headshot.style}` : ''}
${headshot?.retouchLevel ? `Retouch Level: ${headshot.retouchLevel}` : ''}
${flyer?.headline ? `Flyer Headline: ${flyer.headline}` : ''}
${flyer?.dateTime ? `Event Date/Time: ${flyer.dateTime}` : ''}
${flyer?.location ? `Event Location: ${flyer.location}` : ''}
${flyer?.offer ? `Special Offer: ${flyer.offer}` : ''}
${merch?.productType ? `Merch Product: ${merch.productType}` : ''}
${merch?.placement ? `Design Placement: ${merch.placement}` : ''}
${merch?.productColor ? `Product Color: ${merch.productColor}` : ''}
`;

    // Step A: Generate Brand DNA with GPT-4o
    const systemPrompt = `You are a professional Brand Strategist and Logo Designer. Analyze the business idea and user preferences to return a strict JSON object with the following structure:

{
  "brandName": "extracted or suggested brand name",
  "vibe": "brand personality and feeling based on user's style and business type",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "imagePrompts": [
    "DALL-E prompt for icon/symbol logo incorporating user preferences",
    "DALL-E prompt for wordmark/typography logo incorporating user preferences",
    "DALL-E prompt for abstract geometric logo incorporating user preferences",
    "DALL-E prompt for modern emblem/badge logo incorporating user preferences"
  ]
}

Important:
- Return ONLY valid JSON, no markdown formatting
- Incorporate user's selected brand styles: ${brandStyle?.join(', ') || 'modern'}
- Include colors user wants: ${selectedColors?.length ? selectedColors.join(', ') : 'professional palette'}
- AVOID colors: ${colorsToAvoid || 'neon/garish colors'}
- Include symbols/imagery: ${symbolsToInclude || 'industry-relevant'}
- AVOID styles: ${symbolsToAvoid || 'none'}
- Consider usage locations: ${usageLocations?.join(', ') || 'web and print'}
- Create 4 distinct prompts optimized for DALL-E 3 logo generation
- Use professional color palette that matches user preferences
- Each prompt should be detailed and specific to the business type and user preferences
- Ensure all prompts follow best practices for AI logo generation`;

    const brandResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please analyze this brand context and create custom logo generation prompts:\n\n${brandContext}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500
    });

    const brandDNA = JSON.parse(brandResponse.choices[0].message.content);

    // Step B: Generate 4 images in parallel using DALL-E 3
    const imagePromises = brandDNA.imagePrompts.map(async (prompt, index) => {
      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'vivid'
        });

        return {
          index,
          imageUrl: response.data[0].url,
          revisedPrompt: response.data[0].revised_prompt,
          style: ['Icon', 'Wordmark', 'Abstract', 'Modern'][index],
          prompt: prompt
        };
      } catch (error) {
        console.error(`Error generating image ${index}:`, error);
        throw error;
      }
    });

    // Wait for all images to be generated
    const generatedImages = await Promise.all(imagePromises);

    // Upload images to Cloudinary for permanent storage
    console.log('☁️ Starting Cloudinary upload for', generatedImages.length, 'images');
    const cloudinaryUrls = await Promise.all(generatedImages.map(async (img, index) => {
      try {
        console.log(`📤 Uploading image ${index + 1} to Cloudinary...`);

        // Generate a unique public ID
        const brandName = brandDNA.brandName?.replace(/[^a-zA-Z0-9]/g, '_') || 'logo';
        const timestamp = Date.now();
        const publicId = `1dollarlogo_${userId}_${brandName}_${img.style.toLowerCase()}_${timestamp}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(img.imageUrl, {
          public_id: publicId,
          folder: '1dollarlogo/logos',
          resource_type: 'image',
          format: 'png',
          quality: 'auto:good',
          fetch_format: 'auto',
          secure: true
        });

        console.log(`✅ Image ${index + 1} uploaded to Cloudinary:`, result.secure_url);
        return {
          ...img,
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id
        };
      } catch (uploadError) {
        console.error(`❌ Failed to upload image ${index + 1} to Cloudinary:`, uploadError);
        // Fallback to original OpenAI URL if Cloudinary fails
        return {
          ...img,
          cloudinaryUrl: img.imageUrl,
          publicId: null
        };
      }
    }));

    console.log('🎯 All images processed, Cloudinary URLs:', cloudinaryUrls.map(img => img.cloudinaryUrl));

    // Prepare the response using Cloudinary URLs
    const result = {
      brandName: brandDNA.brandName,
      vibe: brandDNA.vibe,
      colorPalette: brandDNA.colorPalette,
      logos: cloudinaryUrls.map((img, index) => ({
        id: index,
        style: img.style,
        imageUrl: img.cloudinaryUrl, // Use Cloudinary URL instead of OpenAI URL
        originalUrl: img.imageUrl, // Keep original for reference
        prompt: img.prompt,
        revisedPrompt: img.revisedPrompt,
        description: `${img.style} design for ${brandDNA.brandName}`,
        publicId: img.publicId
      }))
    };

    // Save to Firestore
    let generationId;
    try {
      console.log('🔥 Starting Firestore save for user:', userId);
      console.log('📋 Brand DNA data:', {
        brandName: brandDNA.brandName,
        vibe: brandDNA.vibe,
        hasImagePrompts: brandDNA.imagePrompts?.length || 0,
        hasColorPalette: brandDNA.colorPalette?.length || 0
      });
      console.log('🖼️ Generated images count:', generatedImages.length);
      console.log('🔗 Image URLs:', generatedImages.map(img => img.imageUrl));

      // Create generation document in user's generations sub-collection
      const generationData = {
        userId: userId,
        brandName: brandName,
        businessType: businessType,
        selectedProducts: selectedProducts,
        selectedColors: selectedColors,
        brandStyle: brandStyle,
        usageLocations: usageLocations,
        colorsToAvoid: colorsToAvoid,
        symbolsToInclude: symbolsToInclude,
        symbolsToAvoid: symbolsToAvoid,
        selectedPlatforms: selectedPlatforms,
        contactInfo: contactInfo,
        headshot: headshot,
        flyer: flyer,
        merch: merch,
        brandDNA: brandDNA,
        logoUrls: cloudinaryUrls.map(img => img.cloudinaryUrl),
        originalUrls: cloudinaryUrls.map(img => img.imageUrl),
        publicIds: cloudinaryUrls.map(img => img.publicId),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      console.log('💾 Attempting to save generation data:', {
        userId: generationData.userId,
        hasBrandDNA: !!generationData.brandDNA,
        logoUrlsCount: generationData.logoUrls.length,
        hasTimestamp: !!generationData.createdAt
      });

      // Save to user's generations sub-collection
      const generationRef = await db.collection('users').doc(userId).collection('generations').add(generationData);
      generationId = generationRef.id;

      console.log('✅ Generation saved to Firestore with ID:', generationId);
      console.log('📄 Document path:', `users/${userId}/generations/${generationId}`);

      // Update user document with lastGenerationAt
      console.log('🔄 Updating user document:', userId);
      await db.collection('users').doc(userId).update({
        lastGenerationAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ User document updated successfully');

    } catch (firestoreError) {
      console.error('💥 CRITICAL ERROR saving to Firestore:', {
        message: firestoreError.message,
        stack: firestoreError.stack,
        code: firestoreError.code,
        details: firestoreError.details
      });
      console.log('❌ Generation NOT saved to Firestore - this is why logos disappear on refresh');
      // Continue with response even if Firestore save fails
    }

    console.log('🎯 Final response data:', {
      success: true,
      brandName: result.brandName,
      logosCount: result.logos?.length || 0,
      generationId: generationId,
      hasGenerationId: !!generationId
    });

    res.json({
      success: true,
      data: {
        ...result,
        generationId: generationId
      }
    });

  } catch (error) {
    console.error('Error generating brand strategy:', error);

    if (error.message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate brand strategy',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
