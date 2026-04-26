import OpenAI from 'openai';
import { db, admin } from '../firebaseAdmin.js';
import { v2 as cloudinary } from 'cloudinary';

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
      businessIdea: generationData.businessIdea,
      brandDNA: generationData.brandDNA ? 'exists' : 'missing',
      logoUrls: generationData.logoUrls?.length || 0,
      createdAt: generationData.createdAt
    });

    // Transform the data to match the frontend expected format
    const formattedData = {
      brandName: generationData.brandDNA?.brandName || generationData.businessIdea?.split(' ')[0] || 'Brand',
      vibe: generationData.brandDNA?.vibe || 'Modern',
      colorPalette: generationData.brandDNA?.colorPalette || ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      businessIdea: generationData.businessIdea || '',
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

// Generate brand DNA and logos using OpenAI GPT-4o and DALL-E 3
export const generateBrandStrategy = async (req, res) => {
  try {
    const { businessIdea } = req.body;
    const userId = req.user?.uid; // Get userId from authenticated request

    // Validate input
    if (!businessIdea || businessIdea.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Business idea must be at least 10 characters long'
      });
    }

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

    // Step A: Generate Brand DNA with GPT-4o
    const systemPrompt = `You are a professional Brand Strategist and Logo Designer. Analyze the business idea and return a strict JSON object with the following structure:

{
  "brandName": "extracted or suggested brand name",
  "vibe": "brand personality and feeling (e.g., modern, playful, elegant, techy)",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "imagePrompts": [
    "Flat vector logo, minimalist, [styleDescriptor] icon design, [industry] symbol, [vibe] aesthetic, white background, professional, clean lines",
    "Flat vector logo, minimalist, [styleDescriptor] wordmark typography, [industry] text-based logo, [vibe] aesthetic, white background, professional, clean lines",
    "Flat vector logo, minimalist, [styleDescriptor] abstract geometric design, [industry] concept, [vibe] aesthetic, white background, professional, clean lines",
    "Flat vector logo, minimalist, [styleDescriptor] modern emblem design, [industry] badge concept, [vibe] aesthetic, white background, professional, clean lines"
  ]
}

Important:
- Return ONLY valid JSON, no markdown formatting
- Extract meaningful brand elements from the business idea
- Create 4 distinct DALL-E prompts optimized for logo generation
- Use professional color palette appropriate for the industry
- Replace [styleDescriptor], [industry], and [vibe] with actual values based on the business idea
- Ensure all prompts follow the base template structure`;

    const brandResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Analyze this business idea: "${businessIdea}"`
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
      businessIdea: businessIdea,
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
        businessIdea: businessIdea,
        brandDNA: brandDNA,
        logoUrls: cloudinaryUrls.map(img => img.cloudinaryUrl), // Save Cloudinary URLs
        originalUrls: cloudinaryUrls.map(img => img.imageUrl), // Keep OpenAI URLs for reference
        publicIds: cloudinaryUrls.map(img => img.publicId),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      console.log('💾 Attempting to save generation data:', {
        userId: generationData.userId,
        businessIdea: generationData.businessIdea,
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
