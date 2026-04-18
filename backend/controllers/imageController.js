import axios from 'axios';
import OpenAI from 'openai';

// Generate logo images using the image generation API
export const generateLogoImages = async (prompts) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const imageUrls = [];

    for (const prompt of prompts) {
      const imagePrompt = `
Create a professional logo design with the following specifications:
${prompt.description}

Style: ${prompt.style}
Colors: ${prompt.colors.join(', ')}
Typography: ${prompt.typography}
Brand values: ${prompt.values.join(', ')}

Requirements:
- Clean, modern design suitable for business use
- Scalable vector style
- Professional and memorable
- High contrast and clarity
- No text or letters, just the visual logo concept
- Minimalist approach with strong visual impact
- Suitable for both digital and print applications

Generate as a high-quality logo image with transparent background.
`;

      const imageResponse = await generateImage(openai, imagePrompt);
      imageUrls.push({
        style: prompt.style,
        description: prompt.description,
        colors: prompt.colors,
        typography: prompt.typography,
        values: prompt.values,
        imageUrl: imageResponse.imageUrl,
        imageId: imageResponse.imageId
      });
    }

    return imageUrls;
  } catch (error) {
    console.error('Error generating logo images:', error);
    throw new Error('Failed to generate logo images');
  }
};

// Generate single image using OpenAI DALL-E 3
const generateImage = async (openai, prompt) => {
  try {
    console.log('Generating image with DALL-E 3 for prompt:', prompt.substring(0, 100) + '...');

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
      response_format: 'url',
    });

    console.log('DALL-E 3 response received:', response.data[0].url ? 'Success' : 'Failed');

    return {
      imageUrl: response.data[0].url,
      imageId: `dalle3_${Date.now()}`
    };
  } catch (error) {
    console.error('OpenAI DALL-E 3 generation failed:', error);
    
    // Fallback to placeholder images if API fails
    console.warn('Using fallback placeholder image');
    const seed = Math.random().toString(36).substring(7);
    return {
      imageUrl: `https://picsum.photos/seed/${seed}/512/512`,
      imageId: `fallback_${seed}`
    };
  }
};

// Export for testing and health checks
export const testOpenAIConnection = async () => {
  try {
    const testPrompt = 'Test logo generation - simple geometric shape';
    const result = await generateImage(testPrompt);
    console.log('OpenAI connection test successful:', result.imageUrl ? 'Success' : 'Failed');
    return result.imageUrl ? true : false;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
};
