import axios from 'axios';
import OpenAI from 'openai';
import sharp from 'sharp';

// Generate single logo with full pipeline (OpenAI -> Download -> Watermark)
const generateSingleLogo = async (prompt, openai) => {
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
  console.log('--- Step 2: DALL-E URL received:', imageResponse.imageUrl);
  
  // Apply watermark to the image
  const watermarkedImageBuffer = await applyWatermark(imageResponse.imageUrl);
  
  return {
    style: prompt.style,
    description: prompt.description,
    colors: prompt.colors,
    typography: prompt.typography,
    values: prompt.values,
    imageUrl: imageResponse.imageUrl, // Keep original URL for reference
    imageId: imageResponse.imageId,
    watermarkedBuffer: watermarkedImageBuffer // Add watermarked buffer
  };
};

// Generate logo images using OpenAI DALL-E 3 with parallel processing
export const generateLogoImages = async (prompts) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log('Starting parallel generation of', prompts.length, 'logos');
    
    // Process all logos in parallel using Promise.all
    const imagePromises = prompts.map(prompt => generateSingleLogo(prompt, openai));
    const imageUrls = await Promise.all(imagePromises);
    
    console.log('All logos generated in parallel');
    return imageUrls;
  } catch (error) {
    console.error('Parallel generation failed:', error);
    throw new Error('Failed to generate logo images');
  }
};

// Generate single image using OpenAI DALL-E 3
const generateImage = async (openai, prompt) => {
  try {

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
      response_format: 'url',
    });

    return {
      imageUrl: response.data[0].url,
      imageId: `dalle3_${Date.now()}`
    };
  } catch (error) {
    console.error('DALL-E generation failed:', error);
    throw new Error('Failed to generate image with DALL-E');
  }
};

// Apply watermark to image using Sharp
const applyWatermark = async (imageUrl) => {
  try {
    console.log('--- Step 3: Attempting to download image buffer with axios ---');
    // Download image from URL using axios
    const imageBuffer = await downloadImage(imageUrl);
    
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Failed to download image or empty buffer');
    }
    
    console.log('--- Step 4: Entering Sharp watermark processing ---');
    // Create watermark text
    const watermarkText = 'OneDollarLogo.com';
    
    // Create watermark SVG
    const watermarkSvg = `
      <svg width="200" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="40" fill="rgba(0, 0, 0, 0.3)" rx="4" />
        <text x="100" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="white">
          ${watermarkText}
        </text>
      </svg>
    `;
    
    const watermarkBuffer = Buffer.from(watermarkSvg);
    console.log('--- Step 5: Checking if watermark file exists at path: [SVG Buffer Created] ---');
    
    // Process image with watermark using Sharp
    const watermarkedImage = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .composite([
        {
          input: watermarkBuffer,
          gravity: 'southeast'
        }
      ])
      .png({ quality: 90, compressionLevel: 6 })
      .toBuffer();
    
    return watermarkedImage;
    
  } catch (error) {
    console.log('Error in Image Pipeline');
    // If watermark fails, return original image buffer
    try {
      return await downloadImage(imageUrl);
    } catch (downloadError) {
      console.log('Error in Image Pipeline');
      throw new Error('Both watermark and download failed');
    }
  }
};

// Download image from URL to buffer using axios
const downloadImage = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'OneDollarLogo-Backend/1.0'
      }
    });
    
    const buffer = Buffer.from(response.data);
    
    if (!buffer || buffer.length === 0) {
      throw new Error('Downloaded empty buffer');
    }
    
    return buffer;
    
  } catch (error) {
    console.log('Error in Image Pipeline');
    throw new Error(`Failed to download image: ${error.message}`);
  }
};

// Export for testing and health checks
export const testOpenAIConnection = async () => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const testPrompt = 'Test logo generation - simple geometric shape';
    const result = await generateImage(openai, testPrompt);
    return result.imageUrl ? true : false;
  } catch (error) {
    return false;
  }
};
