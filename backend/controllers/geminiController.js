import OpenAI from 'openai';

// Generate 4 distinct logo prompts using GPT-4o-mini
export const generateLogoPrompts = async (businessDescription) => {
  try {
    // Verify API key is loaded
    if (!process.env.OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY is undefined or missing');
      throw new Error('OPENAI_API_KEY is not configured');
    }
    
    console.log('OPENAI_API_KEY loaded, length:', process.env.OPENAI_API_KEY.length);
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY.trim() });

    const prompt = `
You are a professional brand strategist and logo designer. Based on the following business details, create 4 distinct logo concepts that deeply reflect the brand's DNA and industry context.

Business Details:
"${businessDescription}"

Extract and integrate these elements:
- Business name and initials
- Core industry and target market
- Key services/products offered
- Brand personality and values
- Unique selling points

Generate 4 distinct Logo Concepts:

Concept 1 (Minimalist): A clean, vector-friendly icon with simple typography. Focus on essential elements that represent the core business function. Use geometric shapes and negative space effectively.

Concept 2 (Symbolic): A clever hidden meaning or metaphor related to the industry. Create a visual story that connects to what the business does. Think about symbols that represent trust, growth, innovation, or industry-specific concepts.

Concept 3 (Modern/Tech): Using gradients, sleek lines, and contemporary design elements. Perfect for tech startups, digital services, or forward-thinking businesses. Incorporate modern color schemes and clean aesthetics.

Concept 4 (Typography Focus): Creative use of the brand's initials or name. Transform letters into meaningful visual elements that represent the business. Consider ligatures, custom lettering, or monogram-style designs.

For each concept, provide:
- A detailed visual description optimized for DALL-E 3
- Strategic color palette that matches the brand personality
- Typography recommendations that complement the design
- Key brand values the concept emphasizes

IMPORTANT: Format descriptions for DALL-E 3 using these keywords: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines."

CRITICAL: Avoid including text, slogans, or long words in the visual description that DALL-E might render incorrectly. Focus on visual elements only.

Return ONLY a raw JSON array of 4 objects. No markdown, no explanations, no code blocks.

Each object must contain:
{
  "style": "concept_name",
  "description": "detailed_visual_description_for_DALL-E",
  "colors": ["#hex1", "#hex2", "#hex3"],
  "typography": "typography_style",
  "values": ["value1", "value2"]
}

Make each concept highly relevant to the specific business details provided.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional brand strategist and logo designer. Always return valid JSON arrays without markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const text = response.choices[0].message.content;
    console.log('Raw GPT-4o-mini response:', text);

    // Try to parse as JSON directly first
    let prompts;
    try {
      prompts = JSON.parse(text);
    } catch (firstParseError) {
      // If direct parse fails, try cleaning markdown
      const cleanText = text.replace(/```json|```/g, '').trim();
      try {
        prompts = JSON.parse(cleanText);
      } catch (secondParseError) {
        console.log('JSON parsing failed, using fallback prompts');
        // Return fallback prompts if parsing fails
        return [
          {
            style: "Minimalist",
            description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. A simple geometric icon representing the core business function with clean typography.",
            colors: ["#2563eb", "#1e40af", "#3b82f6"],
            typography: "Clean Sans-serif",
            values: ["simplicity", "clarity", "professional"]
          },
          {
            style: "Symbolic",
            description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. A clever symbol with hidden meaning related to the industry, using negative space effectively.",
            colors: ["#374151", "#111827", "#6b7280"],
            typography: "Elegant Serif",
            values: ["meaning", "trust", "intelligence"]
          },
          {
            style: "Modern/Tech",
            description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. Contemporary design with gradients and sleek lines perfect for digital innovation.",
            colors: ["#dc2626", "#b91c1c", "#ef4444"],
            typography: "Modern Sans-serif",
            values: ["innovation", "technology", "forward-thinking"]
          },
          {
            style: "Typography Focus",
            description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. Creative monogram using brand initials transformed into meaningful visual elements.",
            colors: ["#059669", "#047857", "#10b981"],
            typography: "Custom Lettering",
            values: ["identity", "creativity", "brand-recognition"]
          }
        ];
      }
    }
    
    console.log('Parsed prompts count:', prompts ? prompts.length : 0);
    return prompts;
    
  } catch (error) {
    console.log('OpenAI API error:', error.message);
    // Return fallback prompts if API fails
    return [
      {
        style: "Minimalist",
        description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. A simple geometric icon representing the core business function with clean typography.",
        colors: ["#2563eb", "#1e40af", "#3b82f6"],
        typography: "Clean Sans-serif",
        values: ["simplicity", "clarity", "professional"]
      },
      {
        style: "Symbolic",
        description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. A clever symbol with hidden meaning related to the industry, using negative space effectively.",
        colors: ["#374151", "#111827", "#6b7280"],
        typography: "Elegant Serif",
        values: ["meaning", "trust", "intelligence"]
      },
      {
        style: "Modern/Tech",
        description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. Contemporary design with gradients and sleek lines perfect for digital innovation.",
        colors: ["#dc2626", "#b91c1c", "#ef4444"],
        typography: "Modern Sans-serif",
        values: ["innovation", "technology", "forward-thinking"]
      },
      {
        style: "Typography Focus",
        description: "Flat vector logo, white background, high contrast, professional branding, minimal design, no realistic 3D textures, clean lines. Creative monogram using brand initials transformed into meaningful visual elements.",
        colors: ["#059669", "#047857", "#10b981"],
        typography: "Custom Lettering",
        values: ["identity", "creativity", "brand-recognition"]
      }
    ];
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
    throw new Error('Both AI services failed');
  }
};
