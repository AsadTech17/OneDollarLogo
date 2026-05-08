# OneDollarLogo

AI-powered logo generation platform with a React frontend and Express backend.  
Users describe a business idea, get four generated logo options, and unlock logos using the OPPAL credit system.

## Project Snapshot

- Frontend: React + Vite + Tailwind + Firebase Auth
- Backend: Node.js + Express API
- Database: Firebase Firestore (via Firebase Admin SDK)
- Payments: Stripe Checkout + webhook-based credit fulfillment
- Media: Cloudinary for generated PNGs and vectorized SVGs
- AI currently in production flow: OpenAI GPT-4o + DALL-E 3
- Additional AI dependencies present: Google Generative AI / Vertex AI packages (not active in main runtime flow)

## Is This MERN?

This codebase is **MERN-inspired but not strict MERN**:

- `M` (MongoDB) is replaced with **Firestore**
- `E` (Express) is used
- `R` (React) is used
- `N` (Node.js) is used

If you are documenting this externally, the most accurate description is:
**React + Express + Node + Firestore (Firebase)**.

## Monorepo Structure

```text
OneDollarLogo/
  backend/      # Express API, Firestore, Stripe webhook, AI orchestration
  frontend/     # React/Vite app, auth UI, generation/unlock flows
  ROUTES.md     # API route docs (partially outdated in places)
```

## Tech Stack Details

### Frontend

- React 19
- Vite
- React Router
- Firebase client SDK (auth/session handling)
- Axios + Fetch
- Tailwind CSS

### Backend

- Express 4
- Firebase Admin SDK
- Stripe SDK
- Cloudinary SDK
- OpenAI SDK
- CORS + Morgan + express-rate-limit

### Data + Auth

- Firebase Auth for user identity
- Firebase ID token verification in backend middleware
- Firestore as the source of truth for users, generations, unlocks, and payment processing state

## AI Flow (Current Runtime)

The active generation route is `POST /api/generate`.

1. **Input validation**
   - Requires authenticated user
   - Requires `businessIdea` with minimum length checks

2. **Brand strategy generation (OpenAI GPT-4o)**
   - Backend sends a structured system prompt asking for strict JSON:
     - `brandName`
     - `vibe`
     - `colorPalette`
     - `imagePrompts` (4 prompts)

3. **Image generation (DALL-E 3)**
   - Runs image generation for all 4 prompts
   - Returns style-tagged logo variants (Icon, Wordmark, Abstract, Modern)

4. **Cloudinary persistence**
   - Generated image URLs are uploaded to Cloudinary
   - Cloudinary URLs become canonical image links for app usage

5. **Firestore persistence**
   - Saves generation payload under user subcollection:
     - `users/{uid}/generations/{generationId}`
   - Stores business idea, brand DNA, image URLs, and timestamps

6. **Frontend rendering**
   - Client fetches generation/unlock data and displays logos plus tiered unlock options

## Gemini / Imagen Status

The repository includes `@google/generative-ai` and `@google-cloud/vertexai` dependencies, and some docs mention Gemini-based generation.  
However, the **implemented and wired production flow uses OpenAI GPT-4o + DALL-E 3**.


## OPPAL Credit System (Firestore)

OPPAL is the in-app credit balance used to unlock output quality tiers and/or trigger paid flows.

### Credit Packs (Stripe-linked)

- Starter: 25 credits
- Growth: 75 credits
- Pro: 150 credits
- Enterprise: 300 credits

`POST /api/stripe/create-checkout-session` creates Checkout sessions, and credits are applied only from webhook processing.

### Unlock Tiers (Spending)

- Standard: 10 OPPAL
- Premium: 20 OPPAL
- Exclusive: 35 OPPAL

`POST /api/unlock-logo` deducts credits based on selected tier.

### Firestore Data Model (Observed)

- `users/{uid}`
  - profile + credit balance + purchase metadata
- `users/{uid}/generations/{generationId}`
  - brand DNA + logo URLs + timestamps
- `users/{uid}/unlocks/{generationId_logoIndex}`
  - tier, cost, unlock time, optional vectorization metadata
- `processed_payments/{stripeSessionId}`
  - webhook idempotency and status
- `purchases/{autoId}`
  - purchase log records

### Credit Mutation Behavior

- User creation initializes free balance (`credits: 1`)
- Stripe webhook increments credits with Firestore `FieldValue.increment(...)`
- Unlock route decrements credits with `increment(-cost)`
- Legacy `/api/generate-logo` flow uses transaction-safe deduction middleware

### Security Characteristics

- Backend endpoints rely on Firebase token verification middleware
- Direct "buy credits from frontend" endpoint is intentionally blocked
- Stripe webhook includes signature verification + idempotency document tracking
- Unlock debit and unlock record write are not wrapped in a single transaction, so there is a small consistency window in failure scenarios

## Vectorizer.AI Integration

Vectorizer is integrated into the Exclusive unlock path.

### Trigger

- Runs inside `POST /api/unlock-logo` only when `selectedTier === 'exclusive'`

### Request Pattern

- Downloads selected PNG from Cloudinary URL
- Sends image as multipart `FormData` to Vectorizer API:
  - `POST https://vectorizer.ai/api/v1/vectorize?mode=test&out.svg.simplify=true`
- Uses Basic auth header built from:
  - `API_ID`
  - `API_SECRET`

### Response Handling

- Expects SVG/XML bytes
- Validates output size (`<= 5MB`)
- Uploads resulting SVG to Cloudinary as:
  - folder: `1dollarlogo/vectorized-logos`
  - `resource_type: raw`
  - format: `svg`

### Persistence + Client Use

- Stores vectorization metadata in unlock doc:
  - `svgUrl`
  - `vectorizationStatus: completed`
  - `vectorizedAt`
- Frontend checks unlock data and downloads SVG when available

### Failure Handling

- If vectorization fails in Exclusive flow, backend attempts a full 35-credit refund

## API Highlights

Backend routes are defined in `backend/server.js`.

- `POST /api/generate` - authenticated brand + logo generation
- `POST /api/unlock-logo` - authenticated tier unlock and optional vectorization
- `GET /api/generations/:uid` - fetch latest generation for user
- `GET /api/unlocks/:userId` - fetch unlock records
- `POST /api/stripe/create-checkout-session` - authenticated Stripe session creation
- `POST /api/stripe/webhook` - Stripe webhook receiver (raw body)
- `GET /api/credits/balance` - authenticated credit balance
- `GET /api/credits/packs` - available packs
- `GET /api/credits/tiers` - spending tiers

## Environment Variables

Backend expects at least:

- Firebase
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
- OpenAI
  - `OPENAI_API_KEY`
- Cloudinary
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Stripe
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `FRONTEND_URL`
- Vectorizer.AI
  - `API_ID`
  - `API_SECRET`

## Local Development

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment variables

- Add backend `.env` with all required keys
- Configure frontend Firebase/client env values as needed

### 3) Run services

```bash
# backend
cd backend
npm run dev

# frontend (new terminal)
cd frontend
npm run dev
```

### 4) Open app

- Frontend default: `http://localhost:5173`
- Backend default: `http://localhost:5000`

## Deployment Notes

- Frontend and backend both include `vercel.json`
- Backend exposes Express app as default export for Vercel serverless runtime
- Stripe webhook route is intentionally mounted before JSON body parsing

## Implementation Notes and Gaps

- `ROUTES.md` includes legacy references (e.g., `/api/generate-logo`) and should be updated to match current primary flow (`/api/generate`)
- `server.js` defines `/` route twice; behavior still works but should be cleaned
- Some controllers/services are legacy or partially unused; production-critical logic is concentrated in:
  - `backend/controllers/generationsController.js`
  - `backend/controllers/stripeController.js`
  - `backend/firebaseAdmin.js`

---