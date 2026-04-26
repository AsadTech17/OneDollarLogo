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
import { getUserGenerations as getUserGenerationsHandler, generateBrandStrategy } from './controllers/generationsController.js';
import { buyCreditPack, unlockLogo, getCreditBalance, getCreditPacks, getSpendingTiers } from './controllers/creditsController.js';
import { createCheckoutSession, handleWebhook } from './controllers/stripeController.js';
import { authenticateUser } from './middleware/auth.js';

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
  origin: ['https://one-dollar-logo.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(morgan('combined'));

// IMPORTANT: Stripe webhook must be defined BEFORE express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  console.log('Stripe webhook route hit!');
  handleWebhook(req, res);
});

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
app.post('/api/generate', generateBrandStrategy);

// Credits Routes
app.post('/api/credits/buy-pack', authenticateUser, buyCreditPack);
app.get('/api/credits/balance', authenticateUser, getCreditBalance);
app.get('/api/credits/packs', getCreditPacks);
app.get('/api/credits/tiers', getSpendingTiers);

// Stripe Routes
app.post('/api/stripe/create-checkout-session', authenticateUser, (req, res) => {
  console.log('Stripe checkout session route hit!');
  createCheckoutSession(req, res);
});

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
