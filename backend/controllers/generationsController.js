import OpenAI from 'openai';

// Get user's generations
export const getUserGenerations = async (req, res) => {
  return res.status(200).json({ message: 'Coming Soon' });
};

// Generate brand DNA and logos using OpenAI GPT-4o and DALL-E 3
export const generateBrandStrategy = async (req, res) => {
  try {
    const { businessIdea } = req.body;

    // Validate input
    if (!businessIdea || businessIdea.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Business idea must be at least 10 characters long'
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

    // Prepare the response
    const result = {
      brandName: brandDNA.brandName,
      vibe: brandDNA.vibe,
      colorPalette: brandDNA.colorPalette,
      businessIdea: businessIdea,
      logos: generatedImages.map((img, index) => ({
        id: index,
        style: img.style,
        imageUrl: img.imageUrl,
        prompt: img.prompt,
        revisedPrompt: img.revisedPrompt,
        description: `${img.style} design for ${brandDNA.brandName}`
      }))
    };

    res.json({
      success: true,
      data: result
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
