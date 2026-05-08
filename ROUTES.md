# OneDollarLogo API Routes

This document reflects the routes currently wired in `backend/server.js` and the active controller behavior.

## Base URL

```text
http://localhost:5000
```

## Authentication

Authenticated endpoints require Firebase ID token:

```text
Authorization: Bearer <firebase_id_token>
```

The backend validates tokens using Firebase Admin in `middleware/auth.js`.

## Health and Root

### GET /

- Auth: No
- Description: API root message
- Response:

```json
{ "message": "Welcome to OneDollarLogo API" }
```

### GET /api/health

- Auth: No
- Description: Service health ping
- Response:

```json
{ "status": "OK", "timestamp": "2026-05-08T00:00:00.000Z" }
```

## User Routes

### POST /api/users/create

- Auth: No (expects data needed by controller)
- Description: Create/sync user in Firestore

### GET /api/users/profile

- Auth: No direct middleware on route (controller-level behavior applies)
- Description: Fetch user profile data

## Generation Routes

### POST /api/generate

- Auth: Yes
- Description: Main logo generation flow (brand strategy + 4 logos)
- Current AI flow:
  - GPT-4o generates brand DNA JSON
  - DALL-E 3 generates 4 logo images
  - Images uploaded to Cloudinary
  - Generation saved to Firestore under `users/{uid}/generations/{generationId}`

Request body:

```json
{
  "businessIdea": "AI-powered invoicing app for freelancers"
}
```

Success response (shape):

```json
{
  "success": true,
  "data": {
    "brandName": "FreelanceFlow",
    "vibe": "modern, reliable",
    "colorPalette": ["#111827", "#2563EB", "#14B8A6", "#F59E0B"],
    "businessIdea": "AI-powered invoicing app for freelancers",
    "logos": [
      {
        "id": 0,
        "style": "Icon",
        "imageUrl": "https://res.cloudinary.com/...png",
        "originalUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
        "prompt": "...",
        "revisedPrompt": "...",
        "description": "Icon design for FreelanceFlow",
        "publicId": "1dollarlogo_..."
      }
    ],
    "generationId": "firestore_doc_id"
  }
}
```

Common errors:

- `400`: invalid or too-short `businessIdea`
- `401`: missing/invalid Firebase token
- `500`: provider/config/runtime error

### GET /api/generations/:uid

- Auth: No route middleware currently attached
- Description: Returns latest generation for user (or empty array fallback)

Success response (shape):

```json
{
  "success": true,
  "data": {
    "brandName": "Brand",
    "vibe": "Modern",
    "colorPalette": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    "businessIdea": "...",
    "logos": [],
    "generationId": "..."
  }
}
```

### GET /api/unlocks/:userId

- Auth: No route middleware currently attached
- Description: Returns unlock records for the user

Success response (shape):

```json
{
  "success": true,
  "unlocks": [
    {
      "id": "generationId_logoIndex",
      "generationId": "abc123",
      "logoIndex": 0,
      "tier": "exclusive",
      "cost": 35,
      "unlockedAt": "2026-05-08T00:00:00.000Z"
    }
  ]
}
```

### POST /api/unlock-logo

- Auth: Yes
- Description: Deduct OPPAL credits and unlock selected logo tier

Request body:

```json
{
  "generationId": "abc123",
  "logoIndex": 0,
  "selectedTier": "exclusive"
}
```

Tier costs:

- `standard`: 10
- `premium`: 20
- `exclusive`: 35

Exclusive behavior:

- Triggers Vectorizer.AI
- Uploads SVG output to Cloudinary
- Stores `svgUrl` and `vectorizationStatus` in unlock doc
- Refunds 35 credits if vectorization fails

Success response (shape):

```json
{
  "success": true,
  "message": "Exclusive logo unlocked with vectorization",
  "data": {
    "tier": "exclusive",
    "cost": 35,
    "remainingBalance": 120,
    "svgUrl": "https://res.cloudinary.com/...svg",
    "vectorizationStatus": "completed"
  }
}
```

## Credits Routes

### POST /api/credits/buy-pack

- Auth: Yes
- Description: Disabled intentionally for security
- Response: `403` with message to use Stripe checkout

### GET /api/credits/balance

- Auth: Yes
- Description: Returns user credit balance

### GET /api/credits/packs

- Auth: No
- Description: Returns available credit packs

### GET /api/credits/tiers

- Auth: No
- Description: Returns unlock spending tiers

## Stripe Routes

### POST /api/stripe/create-checkout-session

- Auth: Yes
- Description: Creates Stripe Checkout session for selected plan

Request body:

```json
{
  "planName": "starter"
}
```

Plan mapping:

- `starter` => $9.00 => 25 credits
- `growth` => $24.00 => 75 credits
- `pro` => $45.00 => 150 credits
- `enterprise` => $79.00 => 300 credits

### POST /api/stripe/webhook

- Auth: Stripe signature (not Firebase auth)
- Description: Stripe webhook receiver (raw body)
- Notes:
  - Signature verified using `STRIPE_WEBHOOK_SECRET`
  - Responds quickly, then processes in background
  - Uses `processed_payments/{sessionId}` for idempotency before credit increment

## Legacy / Auxiliary Routes

### POST /api/generate-logo

- Auth: No Firebase middleware on route
- Middleware: rate limiter + credit check + deduct
- Status: Legacy flow (controller currently returns `"Coming Soon"`)

Rate limit:

- 10 requests / 10 minutes

### GET /api/logo-service/health

- Auth: No
- Status: Depends on legacy logo service controller behavior

### GET /api/download-image?url=<encoded-url>

- Auth: No
- Description: Proxy endpoint for image download/CORS bypass
- Behavior: Fetches remote image and streams as attachment

## Common Status Codes

- `200`: success
- `400`: bad request / validation issue
- `401`: auth required or invalid token
- `403`: forbidden action
- `404`: resource not found
- `429`: rate limit exceeded
- `500`: internal error

## Notes

- Source of truth for routes: `backend/server.js`
- Source of truth for generation/unlock logic: `backend/controllers/generationsController.js`
- Source of truth for payments: `backend/controllers/stripeController.js`
