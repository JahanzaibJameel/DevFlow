# DevFlow - AI-Powered Project Management Platform

🚀 **Enterprise-grade project management with AI integration, built for modern teams**

## 🎯 Features

✨ **AI-Powered Intelligence**
- Automatic task decomposition from project briefs
- Smart bug analysis and debugging suggestions
- Deadline estimation with confidence scores
- Auto-generated standup reports

🎯 **Task Management**
- Kanban board with drag-and-drop
- Multiple views: List, Kanban, Calendar
- Real-time task updates
- Priority and status filtering
- Task dependencies and relationships

👥 **Team Collaboration**  
- Real-time collaboration features
- Comments and mentions on tasks
- File sharing and attachments
- Activity feed and notifications

📊 **Analytics & Dashboards**
- KPI cards and metrics
- Project progress visualization
- Team performance analytics
- Usage tracking and reports

🔐 **Security & Access Control**
- OAuth 2.0 authentication (Google, GitHub)
- Role-based access control
- Audit logs and activity tracking
- Workspace-level permissions

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16.1.4 with App Router
- React 19 with Strict Mode
- TypeScript 5.9
- Tailwind CSS 4
- Zustand for state management
- React Query for async operations
- React Hook Form + Zod for validation
- Radix UI for headless components

**Backend:**
- Supabase for real-time database
- Server-side rendering with Next.js
- Edge functions for serverless compute
- PostgreSQL for data storage

**AI/ML:**
- OpenAI GPT-4 for intelligent features
- Rate limiting and usage tracking
- Comprehensive error handling

**DevTools:**
- ESLint + TypeScript Linting
- Vitest for unit testing
- Playwright for E2E testing
- PostHog for analytics

## 📁 Project Structure

```
devflow/
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   │   ├── (auth)/          # Auth routes (login, register, forgot-password)
│   │   ├── dashboard/       # Protected dashboard & nested pages
│   │   ├── projects/        # Project management
│   │   ├── tasks/           # Task management
│   │   ├── api/             # API routes (RESTful)
│   │   │   ├── projects/    # Project CRUD endpoints
│   │   │   ├── tasks/       # Task CRUD endpoints
│   │   │   ├── ai/          # AI feature endpoints
│   │   │   └── notifications/ # Notification endpoints
│   │   └── middleware.ts    # Auth middleware
│   │
│   ├── components/          # Reusable React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── kanban/          # Kanban board components
│   │   ├── layout/          # Layout components (sidebar, header)
│   │   ├── shared/          # Shared components (error boundary, empty states)
│   │   ├── ui/              # Base UI components (buttons, cards, etc.)
│   │   └── providers/       # Context & provider components
│   │
│   ├── lib/
│   │   ├── ai/              # AI service & utilities
│   │   ├── hooks/           # Custom React hooks
│   │   ├── supabase/        # Supabase client & server setup
│   │   └── utils/           # Utility functions & helpers
│   │
│   ├── store/               # Zustand state stores
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # Global styles
│   └── tests/               # Test files
│
├── public/                  # Static assets
├── supabase/                # Database migrations
└── config files             # Next.js, TypeScript, etc.
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

   Required variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📚 Key Modules

### Authentication (`lib/supabase/`)
- **client.ts**: Browser-side Supabase client
- **server.ts**: Server-side Supabase client
- **middleware.ts**: Session management middleware
- **database.types.ts**: Complete TypeScript type definitions

### State Management (`store/`)
```typescript
// Workspace store
useWorkspaceStore() // Manages current workspace & settings
useTaskStore()      // Manages task filters & view mode
```

### Custom Hooks (`lib/hooks/`)
```typescript
useAsync()          // Handle async operations
useLocalStorage()   // Persist data to localStorage
useDebounce()       // Debounce values
useClickOutside()   // Detect outside clicks
```

### Utilities (`lib/utils/`)
```typescript
cn()                // Combine/merge CSS classes
formatCurrency()    // Format numbers as currency
formatRelativeTime() // Format dates as relative time
rateLimit()         // In-memory rate limiting
```

## 🔌 API Endpoints

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/[id]` - Get task details
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### AI Features
- `POST /api/ai/decompose` - Decompose project brief into tasks
- `POST /api/ai/analyze-bug` - Analyze errors with code context
- `POST /api/ai/enhance-description` - AI-enhance task descriptions
- `POST /api/ai/estimate-deadline` - Estimate task duration
- `POST /api/ai/generate-standup` - Generate standup reports

### Utilities
- `POST /api/upload` - Upload files
- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get user notifications
- `GET /api/health` - Health check

## 🎨 Component Library

### Layout Components
- `Sidebar` - Navigation sidebar
- `Header` - Top navbar with search & notifications
- `ErrorBoundary` - Error handling wrapper

### Dashboard Components
- `KpiCards` - KPI metrics display
- `ProjectProgressChart` - Progress visualization
- `ActivityFeed` - Recent activities
- `UpcomingDeadlines` - Deadline reminders

### Shared Components
- `EmptyState` - Empty state UI
- `LoadingSkeletons` - Loading placeholders
- `TaskCard` - Individual task component

## 🔐 Security Features

1. **Authentication**
   - Supabase Auth with OAuth support
   - Session refresh middleware
   - Protected API routes

2. **Data Protection**
   - Row-level security (RLS) policies
   - Input validation with Zod schemas
   - SQL injection prevention

3. **Rate Limiting**
   - Per-user rate limiting on AI endpoints
   - Configurable limits per endpoint
   - Graceful error responses

4. **Audit Trail**
   - Activity logging
   - Change tracking
   - User session management

## 📊 Performance Optimizations

1. **Frontend**
   - Code splitting via Next.js
   - Image optimization
   - CSS-in-JS with Tailwind
   - React Compiler enabled

2. **Backend**
   - Database query optimization
   - Caching strategies
   - Edge functions
   - API response compression

3. **State Management**
   - React Query caching
   - Zustand persistence
   - Minimal re-renders

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Environment Variables

See `.env.example` for all required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# OpenAI
OPENAI_API_KEY=...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Docker
```bash
docker build -t devflow .
docker run -p 3000:3000 devflow
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/your-repo/issues)
- Discussions: [Ask questions](https://github.com/your-repo/discussions)
- Email: support@devflow.dev

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Custom workflows
- [ ] API public access
- [ ] Webhooks integration
- [ ] SSO for enterprises
- [ ] Time tracking
- [ ] Budget management

---

**Built with ❤️ for teams that move fast**
