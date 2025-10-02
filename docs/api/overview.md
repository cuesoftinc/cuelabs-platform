# API Documentation Overview

## Introduction

The CueLABS™ API is built using Next.js API Routes and provides RESTful endpoints for managing users, projects, bounties, and marketplace functionality. All API endpoints are located under `/api/` and return JSON responses.

## Base URL

```
Production: https://cuelabs.cuesoft.io/api
Development: http://localhost:3000/api
```

## Authentication

The API uses NextAuth.js for authentication with GitHub OAuth. Most endpoints require authentication via session cookies.

### Authentication Flow

1. **Login**: Redirect to `/api/auth/signin/github`
2. **Callback**: GitHub redirects to `/api/auth/callback/github`
3. **Session**: Access user session via `/api/auth/session`
4. **Logout**: POST to `/api/auth/signout`

### Session Management

```typescript
// Session object structure
interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  expires: string;
}
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "data": {
    // Response data
  },
  "status": "success"
}
```

### Error Response

```json
{
  "error": "Error message",
  "status": "error",
  "code": "ERROR_CODE"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

API requests are subject to rate limiting:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Data Types

### Common Field Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | "John Doe" |
| `number` | Numeric value | 100 |
| `boolean` | True/false value | true |
| `date` | ISO 8601 date string | "2023-12-01T10:00:00Z" |
| `array` | List of values | ["item1", "item2"] |
| `object` | Nested object | {"key": "value"} |

### Airtable Record Structure

All records from Airtable follow this structure:

```typescript
interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: T;
}
```

## Pagination

List endpoints support pagination using query parameters:

```
GET /api/users?offset=0&limit=20
```

### Pagination Response

```json
{
  "records": [...],
  "offset": "rec123456789",
  "hasMore": true
}
```

## Filtering and Sorting

### Filtering

Use query parameters to filter results:

```
GET /api/bounties?status=open&reward_min=100
```

### Sorting

Use the `sort` parameter:

```
GET /api/projects?sort=created_at&order=desc
```

## Error Handling

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Malformed request |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid input data |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

### Error Response Examples

```json
// Validation Error
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}

// Not Found Error
{
  "error": "User not found",
  "code": "NOT_FOUND"
}
```

## API Endpoints Overview

### Authentication Endpoints

- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### User Management

- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `GET /api/users/me` - Get current user

### Project Management

- `GET /api/projects` - List projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project

### Bounty Management

- `GET /api/bounties` - List bounties
- `GET /api/bounties/{id}` - Get bounty by ID
- `POST /api/bounties` - Create bounty
- `PUT /api/bounties/{id}` - Update bounty

### Submission Management

- `GET /api/submissions` - List submissions
- `POST /api/submissions` - Create submission
- `PUT /api/submissions/{id}` - Update submission

### Marketplace

- `GET /api/products` - List products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders

## SDK and Client Libraries

### JavaScript/TypeScript

```typescript
// Example API client usage
// Note: @cuelabs/api-client is a placeholder for future SDK

const api = new CueLabsAPI({
  baseURL: 'https://cuelabs.cuesoft.io/api',
  apiKey: 'your-api-key'  // pragma: allowlist secret
});

// Get user
const user = await api.users.get('user-id');
```

### cURL Examples

```bash
# Get current session
curl -X GET https://cuelabs.cuesoft.io/api/auth/session \
  -H "Cookie: next-auth.session-token=..."

# Get user by ID
curl -X GET https://cuelabs.cuesoft.io/api/users/rec123456 \
  -H "Authorization: Bearer your-token"
```

## Webhooks

CueLABS™ supports webhooks for real-time notifications:

### Supported Events

- `user.created` - New user registration
- `bounty.completed` - Bounty marked as complete
- `submission.approved` - Submission approved
- `order.placed` - New marketplace order

### Webhook Payload

```json
{
  "event": "bounty.completed",
  "timestamp": "2023-12-01T10:00:00Z",
  "data": {
    "bounty_id": "rec123456",
    "user_id": "rec789012"
  }
}
```

## Testing

### Test Environment

```
Base URL: https://staging-cuelabs.cuesoft.io/api
```

### Postman Collection

Download the Postman collection for easy API testing:
[CueLABS™ API Collection](./postman/cuelabs-api.json)

## Support

For API support and questions:

- **Documentation**: [GitHub Repository](https://github.com/cuesoftinc/cuelabs-platform)
- **GitHub Issues**: [github.com/cuesoftinc/cuelabs-platform/issues](https://github.com/cuesoftinc/cuelabs-platform/issues)
- **Email**: <api-support@cuelabs.cuesoft.io>
