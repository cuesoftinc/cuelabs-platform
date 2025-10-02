# Users API

## Overview

The Users API provides endpoints for managing user accounts, profiles, and user-related data in the CueLABS™ platform.

## Endpoints

### Get User by ID

Retrieve a specific user by their unique identifier.

```http
GET /api/users/{id}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique user identifier (Airtable record ID) |

#### Response

**Success (200)**

```json
{
  "id": "rec1234567890",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "John Doe",
    "Email": "john.doe@example.com",
    "Wallet Balance": 1500,
    "Total Earnings": 2500,
    "Status": "Active",
    "Access": "User",
    "Rank": 15,
    "Address": "123 Main St, City, Country",
    "Created At": "2023-12-01T10:00:00.000Z",
    "Modified At": "2023-12-01T15:30:00.000Z",
    "Active Bounties": ["rec9876543210"],
    "Completed Bounties": ["rec1111111111", "rec2222222222"],
    "Projects": ["recAAAAAAA", "recBBBBBBB"],
    "Orders": ["recORDER001", "recORDER002"]
  }
}
```

**Error (404)**

```json
{
  "error": "User not found"
}
```

**Error (500)**

```json
{
  "error": "Failed to fetch user"
}
```

#### Example Request

```bash
curl -X GET "https://cuelabs.cuesoft.io/api/users/rec1234567890" \
  -H "Authorization: Bearer your-session-token"
```

#### Example Response

```json
{
  "id": "rec1234567890",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "Alice Johnson",
    "Email": "alice@example.com",
    "Wallet Balance": 750,
    "Total Earnings": 1200,
    "Status": "Active",
    "Access": "User",
    "Rank": 8,
    "Created At": "2023-11-15T09:30:00.000Z",
    "Modified At": "2023-12-01T14:20:00.000Z",
    "Active Bounties": ["rec5555555555"],
    "Completed Bounties": ["rec3333333333"],
    "Attachments": [
      {
        "id": "attXXXXXXXXXX",
        "url": "https://dl.airtable.com/.../profile.jpg",
        "filename": "profile.jpg",
        "size": 245760,
        "type": "image/jpeg",
        "width": 400,
        "height": 400,
        "thumbnails": {
          "small": {
            "url": "https://dl.airtable.com/.../small.jpg",
            "width": 36,
            "height": 36
          },
          "large": {
            "url": "https://dl.airtable.com/.../large.jpg",
            "width": 200,
            "height": 200
          }
        }
      }
    ]
  }
}
```

---

### Get Current User

Retrieve the currently authenticated user's information.

```http
GET /api/users/me
```

#### Authentication Required

This endpoint requires a valid session token.

#### Response

**Success (200)**

```json
{
  "id": "rec1234567890",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "Current User",
    "Email": "user@example.com",
    "Wallet Balance": 500,
    "Total Earnings": 800,
    "Status": "Active",
    "Access": "User"
  }
}
```

**Error (401)**

```json
{
  "error": "Authentication required"
}
```

---

### Update User

Update user profile information.

```http
PUT /api/users/{id}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | User ID to update |

#### Request Body

```json
{
  "Name": "Updated Name",
  "Address": "New Address",
  "Status": "Active"
}
```

#### Response

**Success (200)**

```json
{
  "id": "rec1234567890",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "Updated Name",
    "Email": "user@example.com",
    "Address": "New Address",
    "Status": "Active",
    "Modified At": "2023-12-01T16:45:00.000Z"
  }
}
```

**Error (400)**

```json
{
  "error": "Invalid request data",
  "details": {
    "field": "Name",
    "message": "Name is required"
  }
}
```

**Error (403)**

```json
{
  "error": "Insufficient permissions"
}
```

---

### List Users

Retrieve a paginated list of users (Admin only).

```http
GET /api/users
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of records to return (default: 20, max: 100) |
| `offset` | string | No | Airtable offset for pagination |
| `status` | string | No | Filter by user status (Active, Inactive, Pending) |
| `sort` | string | No | Sort field (Name, Created At, Total Earnings) |
| `order` | string | No | Sort order (asc, desc) |

#### Response

**Success (200)**

```json
{
  "records": [
    {
      "id": "rec1234567890",
      "createdTime": "2023-12-01T10:00:00.000Z",
      "fields": {
        "Name": "User One",
        "Email": "user1@example.com",
        "Wallet Balance": 500,
        "Status": "Active"
      }
    },
    {
      "id": "rec0987654321",
      "createdTime": "2023-12-01T11:00:00.000Z",
      "fields": {
        "Name": "User Two",
        "Email": "user2@example.com",
        "Wallet Balance": 750,
        "Status": "Active"
      }
    }
  ],
  "offset": "recNEXTRECORD",
  "hasMore": true
}
```

---

### Get User Statistics

Retrieve aggregated statistics for a user.

```http
GET /api/users/{id}/stats
```

#### Response

**Success (200)**

```json
{
  "userId": "rec1234567890",
  "stats": {
    "totalEarnings": 2500,
    "currentBalance": 1500,
    "bountiesCompleted": 15,
    "bountiesActive": 3,
    "projectsParticipated": 8,
    "rank": 12,
    "joinDate": "2023-11-15T09:30:00.000Z",
    "lastActivity": "2023-12-01T14:20:00.000Z"
  }
}
```

---

### Update User Balance

Update a user's Cue Currency balance (Admin only).

```http
PATCH /api/users/{id}/balance
```

#### Request Body

```json
{
  "amount": 100,
  "operation": "add", // "add", "subtract", "set"
  "reason": "Bounty completion reward"
}
```

#### Response

**Success (200)**

```json
{
  "userId": "rec1234567890",
  "previousBalance": 1500,
  "newBalance": 1600,
  "operation": "add",
  "amount": 100,
  "timestamp": "2023-12-01T16:45:00.000Z"
}
```

---

## Data Models

### User Fields

| Field | Type | Description |
|-------|------|-------------|
| `Name` | string | User's display name |
| `Email` | string | User's email address (unique) |
| `Wallet Balance` | number | Current Cue Currency balance |
| `Total Earnings` | number | Lifetime earnings |
| `Status` | string | Account status (Active, Inactive, Pending) |
| `Access` | string | User role (User, Admin) |
| `Rank` | number | User's leaderboard rank |
| `Address` | string | User's shipping address |
| `Created At` | string | Account creation timestamp |
| `Modified At` | string | Last modification timestamp |
| `Active Bounties` | array | List of active bounty IDs |
| `Submitted Bounties` | array | List of submitted bounty IDs |
| `Completed Bounties` | array | List of completed bounty IDs |
| `Projects` | array | List of project IDs user participates in |
| `Orders` | array | List of marketplace order IDs |
| `Attachments` | array | Profile images and attachments |

### Attachment Object

```typescript
interface Attachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
    full: { url: string; width: number; height: number };
  };
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `USER_NOT_FOUND` | User with specified ID does not exist |
| `INVALID_USER_DATA` | Invalid user data in request |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `BALANCE_UPDATE_FAILED` | Failed to update user balance |
| `EMAIL_ALREADY_EXISTS` | Email address already in use |

## Rate Limits

- **Get User**: 100 requests per minute
- **Update User**: 20 requests per minute
- **List Users**: 10 requests per minute (Admin only)
- **Balance Updates**: 5 requests per minute (Admin only)
