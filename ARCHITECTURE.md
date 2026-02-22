# ARCHITECTURE.md - DevFlow Technical Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Next.js 16.1.4 (App Router + Server Components)          │   │
│  │ React 19 + TypeScript + Tailwind CSS                     │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      State Management Layer                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Zustand (Global State) +  React Query (Server State)     │   │
│  │ React Hook Form + Zod (Form Validation)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                        Backend Layer                             │
│  ┌─────────────────────┬──────────────────────────────────────┐ │
│  │ API Routes          │ Middleware                           │ │
│  │ (Route Handlers)    │ (Auth + Validation)                  │ │
│  └─────────────────────┴──────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                      Infrastructure Layer                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Supabase (Database + Auth + Real-time + Storage)         │   │
│  │ PostHog (Analytics)                                       │   │
│  │ OpenAI (AI Features)                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
User Action
    ↓
React Component
    ↓
Form Validation (Zod)
    ↓
API Route Handler
    ↓
Database Operation (Supabase)
    ↓
Response with Metadata
    ↓
Update Store (Zurstand/React Query)
    ↓
Re-render Component
```

## Authentication Flow

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         ↓
┌──────────────────────────────────┐
│ Supabase Auth (OAuth/Email)      │
│ - Token generation               │
│ - Session management             │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ Middleware Session Refresh       │
│ - Validate token                 │
│ - Update expiration              │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ Protected Route Access           │
│ - Authorization check            │
│ - User context available         │
└──────────────────────────────────┘
```

## API Architecture

### Request Flow
```
Client Request
    ↓
Route Handler (src/app/api/...)
    ↓
Authentication Check
    ↓
Input Validation (Zod)
    ↓
Business Logic
    ↓
Database Query (Supabase)
    ↓
Response Formatting (apiSuccess/apiError)
    ↓
Client Response
```

### Rate Limiting Flow
```
Incoming Request
    ↓
Extract User ID
    ↓
Check Rate Limit
    ├─ Under limit → Continue
    └─ Over limit → Return 429
    ↓
Process Request
    ↓
Return Response with Headers
    - X-RateLimit-Limit
    - X-RateLimit-Remaining
    - X-RateLimit-Reset
```

## State Management Strategy

### Zustand Stores
```typescript
// workspace-store.ts
- currentWorkspace: Workspace | null
- workspaces: Workspace[]
- members: User[]
- taskFilters: {status[], priority[], assignee[], project[]}
- viewMode: 'list' | 'kanban' | 'calendar'

// Persisted to localStorage
// With devtools for debugging
```

### React Query Patterns
```typescript
// Queries (Cache)
useQuery({
  queryKey: ['projects', workspaceId],
  queryFn: () => fetchProjects(),
  staleTime: 60000,      // 1 minute
  gcTime: 5 * 60 * 1000, // 5 minutes
})

// Mutations (Side Effects)
useMutation({
  mutationFn: (data) => createProject(data),
  onSuccess: () => queryClient.invalidateQueries(),
})
```

## Component Architecture

### File Organization Pattern
```
component/
├── component.tsx       # Main component
├── component.test.tsx  # Unit tests
├── index.ts            # Export barrel
├── types.ts            # TypeScript interfaces
└── hooks/              # Component-specific hooks
```

### Component Types

**1. Layout Components**
- Sidebar, Header, Footer
- Page structure
- Persistent across routes
- Re-export children prop

**2. Feature Components**
- Projects, Tasks, Teams
- Full features
- Use custom hooks
- Connected to store/queries

**3. Shared Components**
- Cards, Buttons, Forms
- Reusable across features
- No business logic
- Pure presentational

**4. UI Components**
- Base components (shadcn/ui)
- No styling beyond Tailwind
- Fully accessible
- Composable

## Database Schema Design

### Core Tables
```sql
users
├── id (PK)
├── email (UNIQUE)
├── name
├── avatar_url
├── role (admin, user, member)
└── timestamps

workspaces
├── id (PK)
├── name
├── owner_id (FK → users)
├── is_active
└── timestamps

projects
├── id (PK)
├── workspace_id (FK)
├── name
├── status (ACTIVE, ARCHIVED, COMPLETED)
├── priority (LOW, MEDIUM, HIGH, URGENT)
├── budget
└── timestamps

tasks
├── id (PK)
├── project_id (FK)
├── title
├── status (BACKLOG, TODO, IN_PROGRESS, REVIEW, DONE)
├── priority
├── assigned_to (FK → users)
├── due_date
├── estimated_hours
└── timestamps

files
├── id (PK)
├── task_id (FK, nullable)
├── project_id (FK, nullable)
├── user_id (FK)
├── filename
├── file_path (storage path)
├── file_size
└── timestamps
```

## Error Handling Strategy

### Error Boundaries
```
Application
└── ErrorBoundary
    ├── Protected Routes
    │   ├── ErrorBoundary (Route-level)
    │   └── Page Component
    └── Public Routes
```

### API Error Responses
```typescript
{
  success: false,
  error: "error_code",
  message: "Human-readable message",
  timestamp: "2026-02-10T..."
}
```

## Performance Optimizations

### Code Splitting
- Route-based via Next.js
- Component-lazy loading with React.lazy()
- Suspense boundaries for loading

### Caching Strategy
```typescript
// Frontend Cache
- Zustand: localStorage for auth/settings
- React Query: staleTime + gcTime
- HTTP Cache: Cache-Control headers

// Backend Cache
- Database query results cached
- Rate limit data in memory
- Session tokens cached
```

### Image Optimization
- Next.js Image component
- AVIF + WebP conversion
- Responsive sizing
- Lazy loading

## Security Architecture

### Authentication Flow
```
1. User submits credentials
2. Supabase Auth verifies
3. JWT token generated
4. Token stored in cookie (HttpOnly)
5. Middleware validates on each request
6. Token auto-refreshed if expired
```

### Database Security
```
1. Row-Level Security (RLS) Policies
2. Service Role Key for admin tasks
3. Anon Key for client-side operations
4. Input validation before queries
5. Prepared statements only
```

### API Security
```
1. Authentication check first
2. Input validation (Zod schemas)
3. Rate limiting per user
4. CORS properly configured
5. Sensitive data validation
```

## Scalability Considerations

### Current Approach
- Single Supabase project
- In-memory rate limiting
- Client-side caching

### Future Scaling
- Redis for rate limiting
- CDN for static assets
- Database read replicas
- API gateway
- microservices if needed

## Monitoring & Observability

### Analytics (PostHog)
- User events
- Feature usage
- Performance metrics
- Funnel analysis

### Error Tracking
- Console error logging
- API error responses
- User error reports
- Sentry integration (optional)

### Performance Monitoring
- Core Web Vitals
- API response times
- Database query times
- Bundle size analysis

---

**Document Version**: 1.0
**Last Updated**: 2026-02-10
**Architecture Standards**: 2026 Industry Best Practices
