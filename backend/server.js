import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Environment validation
console.log('Environment Check: ' + (process.env.OPENAI_API_KEY ? 'Key Found' : 'Key Missing'));

import { generateLogo, logoServiceHealth } from './controllers/logoController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to OneDollarLogo API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Logo Generation Routes
app.post('/api/generate-logo', generateLogo);
app.get('/api/logo-service/health', logoServiceHealth);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Logo generation endpoint: http://localhost:${PORT}/api/generate-logo`);
});
