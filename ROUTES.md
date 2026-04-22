# OneDollarLogo API Routes Documentation

## Overview

This document outlines the available API endpoints for the OneDollarLogo application.

## Base URL

```
http://localhost:5000
```

## Authentication

Most endpoints require Firebase ID token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

## Endpoints

### POST /api/generate-logo

Generates logos based on a business idea description.

**Authentication**: Required (Firebase ID token)

**Rate Limiting**: 10 requests per 10 minutes per user

**Request Body**:
```json
{
  "businessIdea": "A modern coffee shop with minimalist design and sustainable practices"
}
```

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "businessIdea": "A modern coffee shop with minimalist design and sustainable practices",
    "brandName": "Modern Coffee",
    "niche": "Coffee Shop",
    "vibe": "Modern Minimalist",
    "prompts": [
      "Modern minimalist coffee logo with clean lines",
      "Sustainable coffee shop logo with leaf elements",
      "Contemporary coffee brand with geometric shapes",
      "Artisan coffee logo with typography focus"
    ],
    "logos": [
      {
        "style": "Modern Minimalist",
        "description": "Clean and contemporary design with subtle coffee elements",
        "colors": ["#2C3E50", "#E74C3C", "#ECF0F1"],
        "typography": "Sans-serif, clean and modern",
        "values": ["Simplicity", "Quality", "Sustainability"],
        "imageUrl": "https://res.cloudinary.com/dfxroib8m/image/upload/one_dollar_logos/...",
        "cloudinaryUrl": "https://res.cloudinary.com/dfxroib8m/image/upload/one_dollar_logos/...",
        "cloudinaryPublicId": "modern_coffee_logo_1_1234567890",
        "cloudinaryFormat": "png",
        "cloudinaryWidth": 1024,
        "cloudinaryHeight": 1024,
        "generatedAt": "2023-12-07T10:30:00.000Z"
      }
    ],
    "generatedAt": "2023-12-07T10:30:00.000Z",
    "generationId": "L97DzampOLXOqx2YaRyI",
    "remainingCredits": 5,
    "uploadSummary": {
      "total": 4,
      "successful": 4,
      "failed": 0
    }
  }
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "success": false,
  "message": "Invalid business idea provided"
}
```

401 Unauthorized:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

429 Too Many Requests:
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

500 Internal Server Error:
```json
{
  "success": false,
  "message": "Internal server error"
}
```

### GET /api/generations/:uid

Retrieves all logo generations for a specific user.

**Authentication**: Required (Firebase ID token)

**Parameters**:
- `uid` (path): User ID from Firebase Authentication

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "L97DzampOLXOqx2YaRyI",
      "businessIdea": "A modern coffee shop with minimalist design",
      "brandName": "Modern Coffee",
      "niche": "Coffee Shop",
      "vibe": "Modern Minimalist",
      "createdAt": "2023-12-07T10:30:00.000Z",
      "logos": [
        {
          "style": "Modern Minimalist",
          "description": "Clean and contemporary design",
          "imageUrl": "https://res.cloudinary.com/dfxroib8m/image/upload/...",
          "cloudinaryUrl": "https://res.cloudinary.com/dfxroib8m/image/upload/...",
          "generatedAt": "2023-12-07T10:30:00.000Z"
        }
      ]
    }
  ]
}
```

**Error Responses**:

401 Unauthorized:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "success": false,
  "message": "No generations found for this user"
}
```

## Input Validation

### Business Idea Requirements

- **Minimum Length**: 10 characters
- **Maximum Length**: 300 characters
- **Content Filter**: Offensive language is not allowed

### Offensive Keywords Filter

The following keywords are blocked:
- Explicit content: porn, sex, sexual, erotic, adult, xxx, nsfw, escort, prostitute, hooker, stripper, strip club
- Drug-related: drugs, cocaine, heroin, marijuana, weed
- Violence: kill, murder, suicide, death, violent
- Hate speech: hate, racist, nazi, terrorism, bomb
- Illegal activities: illegal, criminal, fraud, scam, theft

## Rate Limiting

### /api/generate-logo

- **Limit**: 10 requests per 10 minutes
- **Window**: 10 minutes sliding window
- **Per User**: Rate limiting is applied per authenticated user
- **Headers**: Rate limit information is included in response headers

## Error Handling

### Common Error Codes

- **400**: Bad Request - Invalid input or validation errors
- **401**: Unauthorized - Missing or invalid authentication
- **403**: Forbidden - User not authorized for this action
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server-side errors

### Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": "Detailed error code (development only)"
}
```

## Cloudinary Integration

Generated logos are automatically uploaded to Cloudinary for permanent storage:

- **Folder**: `one_dollar_logos`
- **Format**: PNG
- **Quality**: Auto-optimized
- **URLs**: Permanent Cloudinary URLs returned in response

## Firebase Integration

- **Authentication**: Firebase ID tokens for user verification
- **Firestore**: Stores generation data and metadata
- **Storage**: Cloudinary used instead of Firebase Storage for better performance

## Development Notes

- **Environment**: Set `NODE_ENV=development` for detailed error messages
- **CORS**: Enabled for frontend development
- **Logging**: Error-only logging in production
- **Rate Limiting**: Configurable via environment variables
