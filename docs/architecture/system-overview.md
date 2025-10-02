# System Architecture Overview

## Introduction

CueLABS™ is a Next.js-based developer platform that enables community-driven development through a bounty system, project management, and marketplace functionality. This document outlines the system architecture, component relationships, and technical implementation details.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App Router]
        B[React Components]
        C[Redux Store]
        D[TanStack Query]
    end

    subgraph "API Layer"
        E[Next.js API Routes]
        F[NextAuth.js]
    end

    subgraph "External Services"
        G[Airtable Database]
        H[GitHub OAuth]
        I[Vercel Analytics]
    end

    subgraph "Deployment"
        J[Vercel Platform]
    end

    A --> E
    B --> C
    B --> D
    D --> E
    E --> G
    F --> H
    E --> F
    J --> A
    J --> I
```

## Technology Stack

### Frontend Framework

- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** for component-based UI development
- **TypeScript 5** for type safety and enhanced developer experience

### State Management

- **Redux Toolkit** for global application state
- **Redux Persist** for state persistence across sessions
- **TanStack Query** for server state management and caching

### Styling & UI

- **Tailwind CSS 4** with custom design tokens
- **shadcn/ui** component library (New York style)
- **Radix UI** for accessible headless components
- **Lucide React** for consistent iconography

### Authentication & Data

- **NextAuth.js** for authentication management
- **Airtable** as the primary database and CMS
- **GitHub OAuth** for user authentication

## Component Architecture

### Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── platform/          # Authenticated routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Main user interface
│   │   └── admin/        # Administrative interface
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── custom/           # Application-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── store/                # Redux store configuration
└── types/                # TypeScript definitions
```

### Component Hierarchy

```mermaid
graph TD
    A[App Layout] --> B[Platform Layout]
    B --> C[Dashboard Layout]
    B --> D[Admin Layout]
    B --> E[Auth Layout]

    C --> F[Dashboard Pages]
    C --> G[Sidebar Navigation]
    C --> H[Project Components]

    D --> I[Admin Pages]
    D --> J[Admin Sidebar]
    D --> K[Management Components]

    E --> L[Auth Pages]
    E --> M[Auth Forms]
```

## Data Flow Architecture

### State Management Flow

```mermaid
sequenceDiagram
    participant UI as React Component
    participant Store as Redux Store
    participant Query as TanStack Query
    participant API as Next.js API
    participant DB as Airtable

    UI->>Store: Dispatch Action
    Store->>UI: Update State
    UI->>Query: Fetch Data
    Query->>API: HTTP Request
    API->>DB: Database Query
    DB->>API: Response Data
    API->>Query: JSON Response
    Query->>UI: Cached Data
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User as User
    participant App as Next.js App
    participant Auth as NextAuth.js
    participant GitHub as GitHub OAuth
    participant DB as Airtable

    User->>App: Login Request
    App->>Auth: Initiate OAuth
    Auth->>GitHub: Redirect to GitHub
    GitHub->>Auth: Authorization Code
    Auth->>GitHub: Exchange for Token
    GitHub->>Auth: Access Token
    Auth->>DB: Store/Update User
    DB->>Auth: User Data
    Auth->>App: Session Created
    App->>User: Authenticated
```

## Security Architecture

### Authentication & Authorization

- **NextAuth.js** handles OAuth flow and session management
- **GitHub OAuth** provides secure user authentication
- **Session-based** authentication with secure cookies
- **Role-based access control** for admin functionality

### Data Security

- **Environment variables** for sensitive configuration
- **API route protection** with authentication middleware
- **Input validation** on all API endpoints
- **HTTPS enforcement** in production

## Performance Architecture

### Caching Strategy

- **TanStack Query** for client-side data caching
- **Next.js** built-in caching for static assets
- **Vercel Edge Network** for global content delivery
- **Airtable API** rate limiting and optimization

### Optimization Techniques

- **Server-side rendering** for improved initial load times
- **Code splitting** with Next.js dynamic imports
- **Image optimization** with Next.js Image component
- **Bundle optimization** with webpack configuration
