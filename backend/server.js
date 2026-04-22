import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });


import { generateLogo, logoServiceHealth } from './controllers/logoController.js';
import { checkCredits, deductCredits } from './middleware/checkCredits.js';
import { createUser, getUserProfile } from './controllers/userController.js';
import { getUserGenerations as getUserGenerationsHandler } from './controllers/generationsController.js';
import { buyCreditPack, unlockLogo, getCreditBalance, getCreditPacks, getSpendingTiers } from './controllers/creditsController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting configuration for logo generation
const logoGenerationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to OneDollarLogo API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User Management Routes
app.post('/api/users/create', createUser);
app.get('/api/users/profile', getUserProfile);

// Generations Routes
app.get('/api/generations/:uid', getUserGenerationsHandler);

// Credits Routes
app.post('/api/credits/buy-pack', checkCredits, buyCreditPack);
app.post('/api/credits/unlock-logo', checkCredits, unlockLogo);
app.get('/api/credits/balance', checkCredits, getCreditBalance);
app.get('/api/credits/packs', getCreditPacks);
app.get('/api/credits/tiers', getSpendingTiers);

// Logo Generation Routes
app.post('/api/generate-logo', logoGenerationLimiter, checkCredits, generateLogo, deductCredits);
app.get('/api/logo-service/health', logoServiceHealth);

// Image Download Proxy Route (CORS bypass)
app.get('/api/download-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    console.log('Proxying image download:', url);
    
    // Fetch the image from the original URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OneDollarLogo-Backend/1.0',
        'Accept': 'image/png,image/jpeg,image/*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    // Get content type from response
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // Set appropriate headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="logo.png"');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Pipe the image data to the response
    response.body.pipe(res);
    
  } catch (error) {
    console.error('Error in download proxy:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
});

// Start server only for local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Logo generation endpoint: http://localhost:${PORT}/api/generate-logo`);
  });
}

// File ke akhir mein ye add karein
app.get("/", (req, res) => {
  res.send("API is working");
});

// Export for Vercel serverless
export default app;
