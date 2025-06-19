# API Integration Guide

This guide provides detailed information about integrating with the AlphaFrame API, including security protocols, authentication, and best practices.

## Table of Contents
1. [Authentication](#authentication)
2. [Security Protocols](#security-protocols)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Best Practices](#best-practices)

## Authentication

### API Keys
- All API requests must include a valid API key in the `X-API-Key` header
- API keys can be generated in the dashboard under Settings > API Keys
- Keep your API keys secure and never expose them in client-side code

### OAuth 2.0
- For user-specific operations, use OAuth 2.0 authentication
- Follow the standard OAuth 2.0 flow:
  1. Redirect user to authorization endpoint
  2. Handle callback with authorization code
  3. Exchange code for access token
  4. Use access token in subsequent requests

## Security Protocols

### Encryption
- All API communication is encrypted using TLS 1.3
- Sensitive data is encrypted at rest using AES-256
- Passwords are hashed using PBKDF2 with 100,000 iterations

### Data Protection
- Personal identifiable information (PII) is encrypted
- Financial data is encrypted using industry-standard protocols
- Regular security audits are performed

## API Endpoints

### Base URL
```
https://api.alphaframe.com/v1
```

### Available Endpoints

#### Accounts
```
GET /accounts
GET /accounts/{id}
POST /accounts
PUT /accounts/{id}
DELETE /accounts/{id}
```

#### Transactions
```
GET /transactions
GET /transactions/{id}
POST /transactions
PUT /transactions/{id}
DELETE /transactions/{id}
```

#### Rules
```
GET /rules
GET /rules/{id}
POST /rules
PUT /rules/{id}
DELETE /rules/{id}
```

#### Simulations
```
POST /simulations/debt-vs-investment
POST /simulations/scenario
GET /simulations/{id}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details",
    "timestamp": "2024-03-14T12:00:00Z"
  }
}
```

### Common Error Codes
- `AUTH_ERROR`: Authentication failed
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

- 100 requests per minute per API key
- 1000 requests per hour per API key
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Best Practices

### Request Headers
```javascript
{
  'X-API-Key': 'your-api-key',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Error Handling
```javascript
try {
  const response = await fetch('/api/endpoint', {
    headers: {
      'X-API-Key': process.env.API_KEY
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  const data = await response.json();
} catch (error) {
  console.error('API Error:', error);
}
```

### Retry Logic
```javascript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
```

### Security Checklist
- [ ] Use HTTPS for all API requests
- [ ] Store API keys securely
- [ ] Implement proper error handling
- [ ] Use rate limiting
- [ ] Validate all input data
- [ ] Log API requests and responses
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Follow security best practices
- [ ] Regular security audits

## Support

For API support or questions:
- Email: api-support@alphaframe.com
- Documentation: https://docs.alphaframe.com
- Status Page: https://status.alphaframe.com 
