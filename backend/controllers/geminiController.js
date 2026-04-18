import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import OpenAI from 'openai';

// Generate 4 distinct logo prompts using Gemini 1.5 Flash
export const generateLogoPrompts = async (businessDescription) => {
  try {
    // Re-initialize with trimmed key to ensure latest key is used
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    });

    const prompt = `
You are a professional brand strategist and logo designer. Based on the following business description, generate 4 distinct, high-quality logo prompts that capture different aspects of the brand's DNA.

Business Description: "${businessDescription}"

Generate 4 logo prompts, each focusing on a different brand personality:
1. Modern/Minimalist approach
2. Classic/Traditional approach  
3. Creative/Artistic approach
4. Bold/Dynamic approach

For each prompt, provide:
- A clear visual description
- Color palette suggestions
- Typography style recommendations
- Key brand values to emphasize

Format your response as a JSON array with 4 objects, each containing:
{
  "style": "style_name",
  "description": "visual_description",
  "colors": ["color1", "color2", "color3"],
  "typography": "typography_style",
  "values": ["value1", "value2"]
}

Ensure each prompt is distinct and captures different brand personalities while staying true to the core business concept.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response (handle potential markdown formatting)
    const cleanText = text.replace(/```json|```/g, '').trim();
    console.log('Gemini response cleaned:', cleanText.substring(0, 200));
    
    const prompts = JSON.parse(cleanText);
    
    return prompts;
  } catch (error) {
    console.error('Error generating logo prompts:', error);
    
    // Enhanced error logging for debugging
    if (error.message.includes('quota')) {
      console.error('Gemini API quota exceeded');
    } else if (error.message.includes('location')) {
      console.error('Gemini API location not supported');
    } else if (error.message.includes('key')) {
      console.error('Gemini API key invalid or missing');
    } else {
      console.error('Gemini API unknown error:', error);
    }
    
    throw new Error('Failed to generate logo prompts');
  }
};

// Generate single refined prompt for image generation
export const generateImagePrompt = (logoPrompt) => {
  return `
Create a professional logo design with the following specifications:
${logoPrompt.description}

Style: ${logoPrompt.style}
Colors: ${logoPrompt.colors.join(', ')}
Typography: ${logoPrompt.typography}
Brand values: ${logoPrompt.values.join(', ')}

Requirements:
- Clean, modern design suitable for business use
- Scalable vector style
- Professional and memorable
- High contrast and clarity
- No text or letters, just visual logo concept
- Minimalist approach with strong visual impact
- Suitable for both digital and print applications

Generate as a high-quality logo image with transparent background.
`;
};


// Copy and paste this at the bottom of geminiController.js
export const generateOpenAIPrompts = async (businessDescription) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY.trim() });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a logo prompt expert. Return a JSON array of 4 detailed logo design objects. Each object must have: style, description, colors (array), typography, and values (array)."
        },
        { role: "user", content: businessDescription }
      ],
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    // GPT logic to ensure we return an array
    return data.prompts || Object.values(data)[0] || data;
  } catch (error) {
    console.error('OpenAI Fallback Error:', error);
    throw new Error('Both AI services failed');
  }
};
