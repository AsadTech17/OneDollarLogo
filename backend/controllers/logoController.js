import { generateLogoPrompts, generateOpenAIPrompts } from './geminiController.js';
import { generateLogoImages, testOpenAIConnection } from './imageController.js';

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

    console.log('Starting logo generation for:', businessIdea);

    // Step 1: Generate 4 distinct logo prompts using Gemini with OpenAI fallback
    let prompts;
    try {
      prompts = await generateLogoPrompts(businessIdea);
      console.log('Gemini API successful, generated prompts');
    } catch (geminiError) {
      console.error('Gemini API failed, using OpenAI fallback:', geminiError.message);
      try {
        prompts = await generateOpenAIPrompts(businessIdea);
        console.log('OpenAI fallback successful, generated prompts');
      } catch (openaiError) {
        console.error('OpenAI fallback also failed:', openaiError.message);
        throw new Error('Both Gemini and OpenAI APIs failed to generate prompts');
      }
    }
    
    if (!prompts || prompts.length !== 4) {
      throw new Error('Failed to generate the required 4 logo prompts');
    }

    console.log('Generated 4 logo prompts:', prompts.map(p => p.style));

    // Step 2: Generate images for each prompt
    console.log('Generating logo images...');
    const logoImages = await generateLogoImages(prompts);

    console.log('Generated logo images successfully');

    // Step 3: Return the complete response
    res.json({
      success: true,
      data: {
        businessIdea,
        prompts: prompts,
        logos: logoImages,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in logo generation pipeline:', error);
    
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
