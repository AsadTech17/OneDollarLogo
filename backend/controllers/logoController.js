import { generateLogoPrompts } from './geminiController.js';
import { generateLogoImages, testOpenAIConnection } from './imageController.js';
import { saveLogoGeneration, uploadImageToCloudinary, db } from '../firebaseAdmin.js';
import admin from 'firebase-admin';

// Content filter to detect offensive business descriptions
const containsOffensiveContent = (businessIdea) => {
  const idea = businessIdea.toLowerCase();
  
  // List of offensive and inappropriate keywords
  const offensiveKeywords = [
    // Explicit content
    'porn', 'sex', 'sexual', 'erotic', 'adult', 'xxx', 'nsfw',
    'escort', 'prostitute', 'hooker', 'stripper', 'strip club',
    
    // Violence and illegal activities
    'kill', 'murder', 'terrorist', 'terrorism', 'bomb', 'explosive',
    'weapon', 'gun', 'firearm', 'knife', 'weapon', 'drugs',
    'drug dealer', 'cocaine', 'heroin', 'meth', 'weed', 'marijuana',
    'illegal', 'crime', 'criminal', 'gang', 'mafia',
    
    // Hate speech and discrimination
    'nazi', 'hitler', 'kkk', 'racist', 'racism', 'hate', 'discrimination',
    'supremacist', 'extremist', 'white power', 'black power',
    
    // Inappropriate content
    'scam', 'fraud', 'fake', 'counterfeit', 'piracy', 'hack', 'hacker',
    'phishing', 'malware', 'virus', 'trojan', 'spam',
    
    // Harmful activities
    'suicide', 'self harm', 'cutting', 'anorexia', 'bulimia',
    'eating disorder', 'self injury',
    
    // Adult services
    'dating app', 'hookup', 'casual sex', 'one night stand',
    
    // Other inappropriate terms
    'gambling', 'casino', 'betting', 'poker', 'lottery', 'sports betting'
  ];
  
  // Check for offensive keywords
  for (const keyword of offensiveKeywords) {
    if (idea.includes(keyword)) {
      return true;
    }
  }
  
  // Check for suspicious patterns (multiple special characters, etc.)
  const suspiciousPatterns = [
    /\b\d{4,}\b/, // Long numbers (could be phone numbers, IDs)
    /[!@#$%^&*]{3,}/, // Multiple special characters
    /\b[A-Z]{4,}\b/, // All caps words (could be acronyms for inappropriate content)
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(idea)) {
      return true;
    }
  }
  
  return false;
};

// Helper function to extract Brand DNA from business idea
const extractBrandDNA = (businessIdea) => {
  const idea = businessIdea.toLowerCase();
  
  // Extract potential brand name (first 2-3 words)
  const words = businessIdea.split(' ').filter(word => word.length > 0);
  let brandName = words.slice(0, 2).join(' ');
  if (brandName.length > 20) {
    brandName = words[0]; // Use only first word if too long
  }
  
  // Determine niche based on keywords
  let niche = 'General Business';
  if (idea.includes('restaurant') || idea.includes('food') || idea.includes('cafe') || idea.includes('honey') || idea.includes('farm')) {
    niche = 'Food & Agriculture';
  } else if (idea.includes('tech') || idea.includes('software') || idea.includes('app') || idea.includes('digital')) {
    niche = 'Technology';
  } else if (idea.includes('fashion') || idea.includes('clothing') || idea.includes('style')) {
    niche = 'Fashion & Apparel';
  } else if (idea.includes('health') || idea.includes('medical') || idea.includes('fitness')) {
    niche = 'Health & Wellness';
  } else if (idea.includes('education') || idea.includes('school') || idea.includes('learning')) {
    niche = 'Education';
  } else if (idea.includes('real') || idea.includes('property') || idea.includes('home')) {
    niche = 'Real Estate';
  }
  
  // Determine vibe based on descriptive words
  let vibe = 'Professional';
  if (idea.includes('modern') || idea.includes('minimal') || idea.includes('clean')) {
    vibe = 'Modern & Minimal';
  } else if (idea.includes('creative') || idea.includes('artistic') || idea.includes('unique')) {
    vibe = 'Creative & Artistic';
  } else if (idea.includes('bold') || idea.includes('dynamic') || idea.includes('powerful')) {
    vibe = 'Bold & Dynamic';
  } else if (idea.includes('eco') || idea.includes('green') || idea.includes('natural') || idea.includes('organic')) {
    vibe = 'Eco-Friendly & Natural';
  } else if (idea.includes('luxury') || idea.includes('premium') || idea.includes('elegant')) {
    vibe = 'Luxury & Premium';
  }
  
  return {
    brandName: brandName,
    niche: niche,
    vibe: vibe
  };
};

// Main controller for the complete logo generation pipeline
export const generateLogo = async (req, res) => {
  try {
    const { businessIdea } = req.body;

    // Validate input
    if (!businessIdea || businessIdea.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Business idea must be at least 10 characters long'
      });
    }

    // Content filter - check for offensive content
    if (containsOffensiveContent(businessIdea)) {
      return res.status(400).json({
        success: false,
        message: 'Business description contains inappropriate content. Please provide a family-friendly business idea.'
      });
    }

    // Step 1: Generate 4 distinct logo prompts using GPT-4o-mini
    let prompts;
    try {
      console.log('--- Step 1: Sending prompt to GPT-4o-mini ---');
      
      // Add timeout wrapper for Vercel deployment
      const promptPromise = generateLogoPrompts(businessIdea);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Prompt generation timeout')), 25000)
      );
      
      prompts = await Promise.race([promptPromise, timeoutPromise]);
    } catch (promptError) {
      console.error('Prompt generation failed:', promptError.message);
      throw new Error('Failed to generate prompts: ' + promptError.message);
    }
    
    if (!prompts || prompts.length < 4) {
      console.log('Invalid prompts received:', prompts);
      throw new Error('Failed to generate the required 4 logo prompts');
    }

    // Step 2: Generate images for each prompt
    let logoImages;
    try {
      // Add timeout wrapper for image generation
      const imagePromise = generateLogoImages(prompts);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Image generation timeout')), 45000)
      );
      
      logoImages = await Promise.race([imagePromise, timeoutPromise]);
    } catch (imageError) {
      console.error('Image generation failed:', imageError.message);
      throw new Error('Failed to generate images: ' + imageError.message);
    }

    // Step 3: Extract brand DNA and return complete response
    const brandDNA = extractBrandDNA(businessIdea);
    
    // Step 4: Upload images to Cloudinary with error recovery and retry logic
    const uploadedLogos = [];
    
    // Process all Cloudinary uploads in parallel
    console.log('Starting parallel Cloudinary uploads for', logoImages.length, 'logos');
    
    const uploadPromises = logoImages.map(async (logo, index) => {
      try {
        const cloudinaryResult = await uploadImageToCloudinary(
          logo.imageUrl, 
          index, 
          brandDNA.brandName || 'logo',
          logo.watermarkedBuffer || null
        );
        
        return {
          style: logo.style,
          description: logo.description,
          colors: logo.colors,
          typography: logo.typography,
          values: logo.values,
          imageUrl: cloudinaryResult.secure_url,
          originalImageUrl: logo.imageUrl,
          imageId: logo.imageId,
          generatedAt: new Date().toISOString(),
          cloudinaryUrl: cloudinaryResult.secure_url,
          cloudinaryPublicId: cloudinaryResult.public_id,
          cloudinaryFormat: cloudinaryResult.format,
          cloudinaryWidth: cloudinaryResult.width,
          cloudinaryHeight: cloudinaryResult.height,
          uploadFailed: false
        };
      } catch (error) {
        console.error('Cloudinary upload failed for logo', index, ':', error.message);
        
        // Return failed logo object
        return {
          style: logo.style,
          description: logo.description,
          colors: logo.colors,
          typography: logo.typography,
          values: logo.values,
          imageUrl: logo.imageUrl, // Keep original URL
          originalImageUrl: logo.imageUrl,
          imageId: logo.imageId,
          generatedAt: new Date().toISOString(),
          uploadFailed: true,
          errorMessage: `Cloudinary upload failed: ${error.message}`
        };
      }
    });
    
    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);
    uploadedLogos.push(...uploadResults);
    
    console.log('All Cloudinary uploads completed in parallel');
    
    // Step 5: Save generation to Firestore with permanent URLs
    const generationData = {
      businessIdea,
      brandName: brandDNA.brandName,
      niche: brandDNA.niche,
      vibe: brandDNA.vibe,
      logos: uploadedLogos.map(logo => {
        const finalCloudinaryUrl = logo.cloudinaryUrl || logo.imageUrl;
        console.log('Saving to Firebase: ', finalCloudinaryUrl);
        return {
          style: logo.style,
          description: logo.description,
          colors: logo.colors,
          typography: logo.typography,
          values: logo.values,
          imageUrl: finalCloudinaryUrl, // Use Cloudinary URL if available
          imageId: logo.imageId,
        };
      }),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed',
    };

    let savedGenerationId = null;
    if (req.user && req.user.uid) {
      try {
        // Add timeout wrapper for Firestore save
        const firestorePromise = saveLogoGeneration(req.user.uid, generationData);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore save timeout')), 8000)
        );
        
        savedGenerationId = await Promise.race([firestorePromise, timeoutPromise]);
      } catch (firestoreError) {
        console.error('Firestore save failed:', firestoreError.message);
        // Continue with response even if Firestore save fails
      }
    }
    
    // Count successful uploads for response
    const successfulUploads = uploadedLogos.filter(logo => !logo.uploadFailed);
    const failedUploads = uploadedLogos.filter(logo => logo.uploadFailed);
    
    res.json({
      success: true,
      data: {
        businessIdea,
        brandName: brandDNA.brandName,
        niche: brandDNA.niche,
        vibe: brandDNA.vibe,
        prompts: prompts,
        logos: uploadedLogos, // Use logos with permanent Firebase Storage URLs
        generatedAt: new Date().toISOString(),
        generationId: savedGenerationId,
        remainingCredits: res.locals.remainingCredits || 0,
        uploadSummary: {
          total: uploadedLogos.length,
          successful: successfulUploads.length,
          failed: failedUploads.length
        }
      }
    });

  } catch (error) {
    console.log('=== 500 ERROR DETAILS ===');
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    console.log('=== END ERROR DETAILS ===');
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate logos',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Health check for the logo generation service
export const logoServiceHealth = async (req, res) => {
  try {
    // Test Gemini API
    const testPrompt = "Test business for logo generation";
    const prompts = await generateLogoPrompts(testPrompt);
    
    // Test OpenAI API
    const openaiStatus = await testOpenAIConnection();
    
    res.json({
      success: true,
      status: 'healthy',
      services: {
        gemini: 'connected',
        openai: openaiStatus ? 'connected' : 'failed',
        dalle3: openaiStatus ? 'connected' : 'failed'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      services: {
        gemini: 'failed',
        openai: 'unknown',
        dalle3: 'unknown'
      },
      timestamp: new Date().toISOString()
    });
  }
};
