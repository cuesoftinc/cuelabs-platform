# Bounties API

## Overview

The Bounties API provides endpoints for managing development tasks and rewards within projects. Users can view available bounties, submit work, and track their progress.

## Endpoints

### List Bounties

Retrieve a paginated list of bounties with optional filtering.

```http
GET /api/bounties
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of records to return (default: 20, max: 100) |
| `offset` | string | No | Airtable offset for pagination |
| `status` | string | No | Filter by bounty status (Todo, In progress, Done, New) |
| `project_id` | string | No | Filter by project ID |
| `reward_min` | number | No | Minimum reward amount |
| `reward_max` | number | No | Maximum reward amount |
| `genre` | string | No | Filter by bounty genre/category |
| `sort` | string | No | Sort field (Name, Reward, Due Date, Created At) |
| `order` | string | No | Sort order (asc, desc) |
| `search` | string | No | Search in bounty name and description |

#### Response

**Success (200)**

```json
{
  "records": [
    {
      "id": "recBOUNTY001",
      "createdTime": "2023-12-01T10:00:00.000Z",
      "fields": {
        "Name": "Implement GitHub Integration",
        "Description": "Create a robust integration with GitHub API to fetch repository data, manage webhooks, and sync user information.",
        "Status": "Todo",
        "Reward": 500,
        "Genre": "Backend Development",
        "Due Date": "2023-12-15T23:59:59.000Z",
        "Participants": ["recUSER001"],
        "Winner": [],
        "Created At": "2023-12-01T10:00:00.000Z",
        "Modified At": "2023-12-01T10:00:00.000Z"
      }
    },
    {
      "id": "recBOUNTY002",
      "createdTime": "2023-12-01T11:00:00.000Z",
      "fields": {
        "Name": "Design ML Model Architecture",
        "Description": "Design and implement a machine learning model architecture for code analysis and suggestion generation.",
        "Status": "In progress",
        "Reward": 750,
        "Genre": "Machine Learning",
        "Due Date": "2023-12-20T23:59:59.000Z",
        "Participants": ["recUSER002", "recUSER003"],
        "Winner": [],
        "Created At": "2023-12-01T11:00:00.000Z",
        "Modified At": "2023-12-01T14:30:00.000Z"
      }
    }
  ],
  "offset": "recNEXTRECORD",
  "hasMore": true
}
```

#### Example Request

```bash
curl -X GET "https://cuelabs.cuesoft.io/api/bounties?status=Todo&reward_min=100&limit=10" \
  -H "Authorization: Bearer your-session-token"
```

---

### Get Bounty by ID

Retrieve a specific bounty by its unique identifier.

```http
GET /api/bounties/{id}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique bounty identifier (Airtable record ID) |

#### Response

**Success (200)**

```json
{
  "id": "recBOUNTY001",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "Implement GitHub Integration",
    "Description": "Create a robust integration with GitHub API to fetch repository data, manage webhooks, and sync user information. This includes:\n\n- Setting up OAuth authentication\n- Implementing repository data fetching\n- Creating webhook handlers\n- User synchronization logic\n- Error handling and rate limiting",
    "Status": "Todo",
    "Reward": 500,
    "Genre": "Backend Development",
    "Due Date": "2023-12-15T23:59:59.000Z",
    "Participants": [
      {
        "id": "recUSER001",
        "fields": {
          "Name": "Alice Johnson",
          "Email": "alice@example.com"
        }
      }
    ],
    "Winner": [],
    "Created At": "2023-12-01T10:00:00.000Z",
    "Modified At": "2023-12-01T10:00:00.000Z"
  }
}
```

**Error (404)**

```json
{
  "error": "Bounty not found"
}
```

#### Example Request

```bash
curl -X GET "https://cuelabs.cuesoft.io/api/bounties/recBOUNTY001" \
  -H "Authorization: Bearer your-session-token"
```

---

### Create Bounty

Create a new bounty (Admin only).

```http
POST /api/bounties
```

#### Request Body

```json
{
  "Name": "Implement User Dashboard",
  "Description": "Create a comprehensive user dashboard with analytics, project overview, and earnings tracking.",
  "Reward": 600,
  "Genre": "Frontend Development",
  "Due Date": "2023-12-25T23:59:59.000Z",
  "Status": "Todo"
}
```

#### Response

**Success (201)**

```json
{
  "id": "recNEWBOUNTY",
  "createdTime": "2023-12-01T16:00:00.000Z",
  "fields": {
    "Name": "Implement User Dashboard",
    "Description": "Create a comprehensive user dashboard with analytics, project overview, and earnings tracking.",
    "Status": "Todo",
    "Reward": 600,
    "Genre": "Frontend Development",
    "Due Date": "2023-12-25T23:59:59.000Z",
    "Participants": [],
    "Winner": [],
    "Created At": "2023-12-01T16:00:00.000Z",
    "Modified At": "2023-12-01T16:00:00.000Z"
  }
}
```

**Error (400)**

```json
{
  "error": "Validation failed",
  "details": {
    "field": "Name",
    "message": "Bounty name is required"
  }
}
```

**Error (403)**

```json
{
  "error": "Insufficient permissions. Admin access required."
}
```

---

### Update Bounty

Update an existing bounty (Admin only).

```http
PUT /api/bounties/{id}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Bounty ID to update |

#### Request Body

```json
{
  "Name": "Updated Bounty Name",
  "Description": "Updated bounty description with more details",
  "Status": "In progress",
  "Reward": 700,
  "Due Date": "2023-12-30T23:59:59.000Z"
}
```

#### Response

**Success (200)**

```json
{
  "id": "recBOUNTY001",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "Updated Bounty Name",
    "Description": "Updated bounty description with more details",
    "Status": "In progress",
    "Reward": 700,
    "Due Date": "2023-12-30T23:59:59.000Z",
    "Modified At": "2023-12-01T16:30:00.000Z"
  }
}
```

---

### Assign Bounty

Assign a bounty to a user (Admin only).

```http
POST /api/bounties/{id}/assign
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Bounty ID to assign |

#### Request Body

```json
{
  "userId": "recUSER123"
}
```

#### Response

**Success (200)**

```json
{
  "message": "Bounty assigned successfully",
  "bountyId": "recBOUNTY001",
  "assignedTo": "recUSER123",
  "assignedAt": "2023-12-01T16:45:00.000Z"
}
```

**Error (400)**

```json
{
  "error": "Bounty is already assigned"
}
```

**Error (404)**

```json
{
  "error": "User not found"
}
```

---

### Join Bounty

Add current user as a bounty participant.

```http
POST /api/bounties/{id}/join
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Bounty ID to join |

#### Response

**Success (200)**

```json
{
  "message": "Successfully joined bounty",
  "bountyId": "recBOUNTY001",
  "userId": "recUSER123"
}
```

**Error (400)**

```json
{
  "error": "Already participating in this bounty"
}
```

**Error (409)**

```json
{
  "error": "Bounty is already completed"
}
```

---

### Leave Bounty

Remove current user from bounty participants.

```http
POST /api/bounties/{id}/leave
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Bounty ID to leave |

#### Response

**Success (200)**

```json
{
  "message": "Successfully left bounty",
  "bountyId": "recBOUNTY001",
  "userId": "recUSER123"
}
```

**Error (400)**

```json
{
  "error": "Not participating in this bounty"
}
```

---

### Complete Bounty

Mark a bounty as completed and award winner (Admin only).

```http
POST /api/bounties/{id}/complete
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Bounty ID to complete |

#### Request Body

```json
{
  "winnerId": "recUSER123",
  "feedback": "Excellent work! The implementation exceeded expectations."
}
```

#### Response

**Success (200)**

```json
{
  "message": "Bounty completed successfully",
  "bountyId": "recBOUNTY001",
  "winnerId": "recUSER123",
  "reward": 500,
  "completedAt": "2023-12-01T17:00:00.000Z"
}
```

**Error (400)**

```json
{
  "error": "Winner must be a participant in this bounty"
}
```

---

### Get Bounty Submissions

Retrieve submissions for a specific bounty.

```http
GET /api/bounties/{id}/submissions
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Bounty ID |

#### Response

**Success (200)**

```json
{
  "bountyId": "recBOUNTY001",
  "submissions": [
    {
      "id": "recSUBMISSION001",
      "userId": "recUSER123",
      "userName": "Alice Johnson",
      "githubPrUrl": "https://github.com/cuesoftinc/cuelabs-platform/pull/123",
      "description": "Implemented GitHub integration with OAuth and webhook support",
      "status": "pending",
      "submittedAt": "2023-12-01T15:30:00.000Z",
      "feedback": null
    }
  ]
}
```

---

## Data Models

### Bounty Fields

| Field | Type | Description |
|-------|------|-------------|
| `Name` | string | Bounty title/name |
| `Description` | string | Detailed task description |
| `Status` | string | Bounty status (Todo, In progress, Done, New) |
| `Reward` | number | Cue Currency reward amount |
| `Genre` | string | Bounty category/type |
| `Due Date` | string | Deadline for completion |
| `Participants` | array | User IDs or objects of participants |
| `Winner` | array | User ID(s) of bounty winner(s) |
| `Created At` | string | Bounty creation timestamp |
| `Modified At` | string | Last modification timestamp |

### Bounty Status Values

| Status | Description |
|--------|-------------|
| `New` | Recently created bounty |
| `Todo` | Available for assignment |
| `In progress` | Currently being worked on |
| `Done` | Completed and rewarded |

### Bounty Genres

Common bounty categories:

- Frontend Development
- Backend Development
- Machine Learning
- DevOps
- Documentation
- Testing
- Design
- Research

### Expanded Bounty Response

When requesting a single bounty, participants are expanded:

```typescript
interface ExpandedBounty {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    Description: string;
    Status: 'Todo' | 'In progress' | 'Done' | 'New';
    Reward: number;
    Genre: string;
    'Due Date': string;
    Participants: Array<{
      id: string;
      fields: {
        Name: string;
        Email: string;
      };
    }>;
    Winner: string[];
    'Created At': string;
    'Modified At': string;
  };
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `BOUNTY_NOT_FOUND` | Bounty with specified ID does not exist |
| `INVALID_BOUNTY_DATA` | Invalid bounty data in request |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `BOUNTY_ALREADY_ASSIGNED` | Bounty is already assigned to a user |
| `BOUNTY_ALREADY_COMPLETED` | Bounty has already been completed |
| `ALREADY_PARTICIPANT` | User is already participating in bounty |
| `NOT_PARTICIPANT` | User is not participating in bounty |
| `INVALID_WINNER` | Winner must be a bounty participant |
| `DEADLINE_PASSED` | Cannot join bounty after deadline |

## Filtering and Search

### Status Filtering

```bash
GET /api/bounties?status=Todo
```

### Reward Range Filtering

```bash
GET /api/bounties?reward_min=100&reward_max=1000
```

### Genre Filtering

```bash
GET /api/bounties?genre=Frontend%20Development
```

### Project Filtering

```bash
GET /api/bounties?project_id=recPROJECT001
```

### Text Search

```bash
GET /api/bounties?search=GitHub%20integration
```

### Combined Filters

```bash
GET /api/bounties?status=Todo&reward_min=200&genre=Backend&search=API&limit=10
```

### Sorting

```bash
# Sort by reward (highest first)
GET /api/bounties?sort=Reward&order=desc

# Sort by due date (earliest first)
GET /api/bounties?sort=Due%20Date&order=asc
```

## Rate Limits

- **List Bounties**: 50 requests per minute
- **Get Bounty**: 100 requests per minute
- **Create Bounty**: 10 requests per minute (Admin only)
- **Update Bounty**: 20 requests per minute (Admin only)
- **Join/Leave Bounty**: 30 requests per minute
- **Complete Bounty**: 10 requests per minute (Admin only)
- **Get Submissions**: 20 requests per minute
