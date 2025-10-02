# Projects API

## Overview

The Projects API provides endpoints for managing development projects, including creating, updating, and retrieving project information along with associated bounties and participants.

## Endpoints

### List Projects

Retrieve a paginated list of all projects.

```http
GET /api/projects
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of records to return (default: 20, max: 100) |
| `offset` | string | No | Airtable offset for pagination |
| `status` | string | No | Filter by project status (Todo, In progress, Done, New) |
| `sort` | string | No | Sort field (Name, Created At, Modified At) |
| `order` | string | No | Sort order (asc, desc) |
| `search` | string | No | Search in project name and description |

#### Response

**Success (200)**

```json
{
  "records": [
    {
      "id": "recPROJECT001",
      "createdTime": "2023-12-01T10:00:00.000Z",
      "fields": {
        "Name": "AI-Powered Code Review Tool",
        "Description": "Develop an AI assistant that provides intelligent code review suggestions and identifies potential bugs.",
        "Status": "In progress",
        "Tools": ["Python", "Machine Learning", "GitHub API"],
        "Bounties": ["recBOUNTY001", "recBOUNTY002"],
        "Participants": ["recUSER001", "recUSER002"],
        "Created At": "2023-12-01T10:00:00.000Z",
        "Modified At": "2023-12-01T15:30:00.000Z"
      }
    },
    {
      "id": "recPROJECT002",
      "createdTime": "2023-12-01T11:00:00.000Z",
      "fields": {
        "Name": "Open Source Documentation Generator",
        "Description": "Create a tool that automatically generates comprehensive documentation for open source projects.",
        "Status": "Todo",
        "Tools": ["TypeScript", "Next.js", "OpenAI API"],
        "Bounties": ["recBOUNTY003"],
        "Participants": ["recUSER003"],
        "Created At": "2023-12-01T11:00:00.000Z",
        "Modified At": "2023-12-01T11:00:00.000Z"
      }
    }
  ],
  "offset": "recNEXTRECORD",
  "hasMore": true
}
```

#### Example Request

```bash
curl -X GET "https://cuelabs.cuesoft.io/api/projects?status=In%20progress&limit=10" \
  -H "Authorization: Bearer your-session-token"
```

---

### Get Project by ID

Retrieve a specific project by its unique identifier.

```http
GET /api/projects/{id}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique project identifier (Airtable record ID) |

#### Response

**Success (200)**

```json
{
  "id": "recPROJECT001",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "AI-Powered Code Review Tool",
    "Description": "Develop an AI assistant that provides intelligent code review suggestions, identifies potential bugs, and suggests improvements. The tool should integrate with popular version control systems and provide actionable feedback to developers.",
    "Status": "In progress",
    "Tools": ["Python", "Machine Learning", "GitHub API", "OpenAI"],
    "Bounties": [
      {
        "id": "recBOUNTY001",
        "fields": {
          "Name": "Implement GitHub Integration",
          "Reward": 500,
          "Status": "In progress"
        }
      },
      {
        "id": "recBOUNTY002",
        "fields": {
          "Name": "Design ML Model Architecture",
          "Reward": 750,
          "Status": "Todo"
        }
      }
    ],
    "Participants": [
      {
        "id": "recUSER001",
        "fields": {
          "Name": "Alice Johnson",
          "Email": "alice@example.com"
        }
      },
      {
        "id": "recUSER002",
        "fields": {
          "Name": "Bob Smith",
          "Email": "bob@example.com"
        }
      }
    ],
    "Created At": "2023-12-01T10:00:00.000Z",
    "Modified At": "2023-12-01T15:30:00.000Z"
  }
}
```

**Error (404)**

```json
{
  "error": "Project not found"
}
```

#### Example Request

```bash
curl -X GET "https://cuelabs.cuesoft.io/api/projects/recPROJECT001" \
  -H "Authorization: Bearer your-session-token"
```

---

### Create Project

Create a new project (Admin only).

```http
POST /api/projects
```

#### Request Body

```json
{
  "Name": "New AI Project",
  "Description": "A revolutionary AI project that will change the world",
  "Status": "Todo",
  "Tools": ["Python", "TensorFlow", "React"]
}
```

#### Response

**Success (201)**

```json
{
  "id": "recNEWPROJECT",
  "createdTime": "2023-12-01T16:00:00.000Z",
  "fields": {
    "Name": "New AI Project",
    "Description": "A revolutionary AI project that will change the world",
    "Status": "Todo",
    "Tools": ["Python", "TensorFlow", "React"],
    "Bounties": [],
    "Participants": [],
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
    "message": "Project name is required"
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

### Update Project

Update an existing project (Admin only).

```http
PUT /api/projects/{id}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Project ID to update |

#### Request Body

```json
{
  "Name": "Updated Project Name",
  "Description": "Updated project description",
  "Status": "In progress",
  "Tools": ["Python", "TensorFlow", "React", "Docker"]
}
```

#### Response

**Success (200)**

```json
{
  "id": "recPROJECT001",
  "createdTime": "2023-12-01T10:00:00.000Z",
  "fields": {
    "Name": "Updated Project Name",
    "Description": "Updated project description",
    "Status": "In progress",
    "Tools": ["Python", "TensorFlow", "React", "Docker"],
    "Modified At": "2023-12-01T16:30:00.000Z"
  }
}
```

---

### Delete Project

Delete a project (Admin only).

```http
DELETE /api/projects/{id}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Project ID to delete |

#### Response

**Success (204)**
No content returned.

**Error (400)**

```json
{
  "error": "Cannot delete project with active bounties"
}
```

**Error (403)**

```json
{
  "error": "Insufficient permissions. Admin access required."
}
```

---

### Get Project Statistics

Retrieve aggregated statistics for a project.

```http
GET /api/projects/{id}/stats
```

#### Response

**Success (200)**

```json
{
  "projectId": "recPROJECT001",
  "stats": {
    "totalBounties": 15,
    "activeBounties": 5,
    "completedBounties": 8,
    "todosBounties": 2,
    "totalReward": 7500,
    "paidReward": 4000,
    "pendingReward": 3500,
    "participantCount": 12,
    "submissionCount": 25,
    "completionRate": 0.53,
    "averageBountyReward": 500,
    "createdAt": "2023-12-01T10:00:00.000Z",
    "lastActivity": "2023-12-01T15:30:00.000Z"
  }
}
```

---

### Join Project

Add current user as a project participant.

```http
POST /api/projects/{id}/join
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Project ID to join |

#### Response

**Success (200)**

```json
{
  "message": "Successfully joined project",
  "projectId": "recPROJECT001",
  "userId": "recUSER123"
}
```

**Error (400)**

```json
{
  "error": "Already a participant in this project"
}
```

**Error (404)**

```json
{
  "error": "Project not found"
}
```

---

### Leave Project

Remove current user from project participants.

```http
POST /api/projects/{id}/leave
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Project ID to leave |

#### Response

**Success (200)**

```json
{
  "message": "Successfully left project",
  "projectId": "recPROJECT001",
  "userId": "recUSER123"
}
```

**Error (400)**

```json
{
  "error": "Not a participant in this project"
}
```

---

## Data Models

### Project Fields

| Field | Type | Description |
|-------|------|-------------|
| `Name` | string | Project name/title |
| `Description` | string | Detailed project description |
| `Status` | string | Project status (Todo, In progress, Done, New) |
| `Tools` | array | Technologies and tools used |
| `Bounties` | array | Associated bounty IDs or objects |
| `Participants` | array | User IDs or objects of project participants |
| `Created At` | string | Project creation timestamp |
| `Modified At` | string | Last modification timestamp |

### Project Status Values

| Status | Description |
|--------|-------------|
| `New` | Recently created project |
| `Todo` | Project planned but not started |
| `In progress` | Active development in progress |
| `Done` | Project completed |

### Expanded Project Response

When requesting a single project, related bounties and participants are expanded:

```typescript
interface ExpandedProject {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    Description: string;
    Status: 'Todo' | 'In progress' | 'Done' | 'New';
    Tools: string[];
    Bounties: Array<{
      id: string;
      fields: {
        Name: string;
        Reward: number;
        Status: string;
      };
    }>;
    Participants: Array<{
      id: string;
      fields: {
        Name: string;
        Email: string;
      };
    }>;
    'Created At': string;
    'Modified At': string;
  };
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `PROJECT_NOT_FOUND` | Project with specified ID does not exist |
| `INVALID_PROJECT_DATA` | Invalid project data in request |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `PROJECT_NAME_EXISTS` | Project name already exists |
| `CANNOT_DELETE_ACTIVE_PROJECT` | Cannot delete project with active bounties |
| `ALREADY_PARTICIPANT` | User is already a project participant |
| `NOT_PARTICIPANT` | User is not a project participant |

## Filtering and Search

### Status Filtering

```bash
GET /api/projects?status=In%20progress
```

### Tool Filtering

```bash
GET /api/projects?tools=Python,React
```

### Text Search

```bash
GET /api/projects?search=AI%20machine%20learning
```

### Combined Filters

```bash
GET /api/projects?status=In%20progress&tools=Python&search=AI&limit=10
```

## Rate Limits

- **List Projects**: 50 requests per minute
- **Get Project**: 100 requests per minute
- **Create Project**: 10 requests per minute (Admin only)
- **Update Project**: 20 requests per minute (Admin only)
- **Delete Project**: 5 requests per minute (Admin only)
- **Join/Leave Project**: 30 requests per minute
