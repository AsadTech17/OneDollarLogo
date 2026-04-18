# OneDollarLogo Backend API

## Core API Chain for Logo Generation

This backend provides the complete API chain for generating professional logos using Gemini AI and image generation services.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root with the following variables:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
IMAGE_GEN_API_KEY=your_image_gen_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### POST /api/generate-logo
Main endpoint for logo generation pipeline.

**Request Body:**
```json
{
  "businessIdea": "A sustainable coffee shop that sources beans from local farmers..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "businessIdea": "...",
    "prompts": [
      {
        "style": "Modern/Minimalist",
        "description": "...",
        "colors": ["#2C3E50", "#27AE60", "#F39C12"],
        "typography": "Clean sans-serif",
        "values": ["sustainability", "community", "quality"]
      }
    ],
    "logos": [
      {
        "style": "Modern/Minimalist",
        "description": "...",
        "colors": ["#2C3E50", "#27AE60", "#F39C12"],
        "typography": "Clean sans-serif",
        "values": ["sustainability", "community", "quality"],
        "imageUrl": "https://...",
        "imageId": "generated_123"
      }
    ],
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/logo-service/health
Health check for the logo generation service.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "gemini": "connected",
    "imageGeneration": "connected"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Architecture

### Controllers

#### geminiController.js
- `generateLogoPrompts()`: Uses Gemini 1.5 Flash to generate 4 distinct logo prompts
- Each prompt focuses on different brand personalities:
  - Modern/Minimalist
  - Classic/Traditional
  - Creative/Artistic
  - Bold/Dynamic

#### imageController.js
- `generateLogoImages()`: Generates images for each logo prompt
- `generateImage()`: Single image generation with fallback support
- Supports multiple image generation APIs (DALL-E, Stability AI, etc.)

#### logoController.js
- `generateLogo()`: Main controller orchestrating the complete pipeline
- `logoServiceHealth()`: Health check for all services

### Pipeline Flow

1. **Input Validation**: Validate business idea input
2. **Gemini Integration**: Generate 4 distinct logo prompts
3. **Image Generation**: Create images for each prompt
4. **Response Assembly**: Return complete logo package

## Testing

Run the test suite to verify the API chain:

```bash
node test-api.js
```

## Image Generation Service Configuration

The backend supports multiple image generation services. Configure your preferred service by updating the `generateImage()` function in `imageController.js`:

### OpenAI DALL-E
```javascript
// Uncomment and configure in imageController.js
const response = await axios.post('https://api.openai.com/v1/images/generations', {
  prompt: prompt,
  n: 1,
  size: '512x512',
  response_format: 'url'
}, {
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});
```

### Stability AI
```javascript
// Uncomment and configure in imageController.js
const response = await axios.post('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
  prompt: prompt,
  samples: 1,
  cfg_scale: 7,
  height: 512,
  width: 512
}, {
  headers: {
    'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
  }
});
```

## Error Handling

- Input validation with descriptive error messages
- Graceful fallback to placeholder images if image generation fails
- Comprehensive error logging for debugging
- Environment-specific error responses

## Security

- API keys stored in environment variables
- CORS enabled for frontend integration
- Input sanitization and validation
- Rate limiting considerations for production

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Add rate limiting middleware
4. Set up monitoring and logging
5. Configure SSL/HTTPS
6. Set up proper error monitoring

## Frontend Integration

The frontend can call the API using:

```javascript
const response = await fetch('http://localhost:5000/api/generate-logo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    businessIdea: "Your business description here"
  })
});

const result = await response.json();
```

## Troubleshooting

### Common Issues

1. **Gemini API Key Error**: Ensure GEMINI_API_KEY is correctly set in .env
2. **Image Generation Fails**: Check IMAGE_GEN_API_KEY configuration
3. **CORS Issues**: Verify frontend is allowed in CORS settings
4. **Port Conflicts**: Change PORT in .env if 5000 is in use

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages in responses.
