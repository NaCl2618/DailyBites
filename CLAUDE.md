# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DailyBites** is a fullstack web application built with Next.js and bkend.ai BaaS platform.

- **Level**: Dynamic (Intermediate)
- **Stack**: Next.js 15+, TypeScript, Tailwind CSS, bkend.ai BaaS
- **Purpose**: Fullstack SaaS/MVP development with authentication and database features

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev              # Starts on http://localhost:3000

# Build
npm run build           # Production build
npm start              # Start production server

# Linting
npm run lint           # Run ESLint
```

## Project Structure

```
dailybites/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-related routes (login, register)
│   ├── (main)/            # Protected routes (dashboard, settings)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/             # React components
│   ├── ui/                # Basic UI components (Button, Input, etc.)
│   └── features/          # Feature-specific components
│
├── lib/                    # Utilities and configurations
│   ├── bkend.ts           # bkend.ai client configuration
│   └── utils.ts           # Helper functions
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── useQuery.ts        # Data fetching hooks
│
├── stores/                 # State management (Zustand)
│   └── auth-store.ts      # Auth state
│
├── types/                  # TypeScript type definitions
│   └── index.ts
│
└── docs/                   # PDCA documentation
    ├── 01-plan/           # Planning documents
    ├── 02-design/         # Design specifications
    ├── 03-analysis/       # Gap analysis reports
    └── 04-report/         # Completion reports
```

## Architecture

### Frontend Architecture
- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query)
- **Type Safety**: TypeScript strict mode

### Backend (BaaS)
- **Platform**: bkend.ai
- **Features**:
  - Auto-generated REST API
  - MongoDB database
  - Built-in JWT authentication
  - Real-time WebSocket support
  - File storage

### Authentication Flow
1. User submits login/register form
2. Client calls `bkend.auth.login()` or `bkend.auth.register()`
3. Receive JWT token and user data
4. Store in Zustand + localStorage (persist middleware)
5. Include token in subsequent API requests
6. Protected routes check auth state via `useAuth()` hook

### Data Fetching Pattern
- Use TanStack Query for all server state
- Cache invalidation on mutations
- Optimistic updates for better UX
- Error boundaries for graceful error handling

## Key Patterns

### bkend.ai Client Setup
```typescript
// lib/bkend.ts
import { createClient } from '@bkend/client';

export const bkend = createClient({
  apiKey: process.env.NEXT_PUBLIC_BKEND_API_KEY!,
  projectId: process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!,
});
```

### Authentication Hook
```typescript
// hooks/useAuth.ts - Zustand store with persistence
const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        const { user, token } = await bkend.auth.login({ email, password });
        set({ user });
      },
      logout: () => {
        bkend.auth.logout();
        set({ user: null });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

### Data Fetching
```typescript
// List query
const { data, isLoading } = useQuery({
  queryKey: ['items', filters],
  queryFn: () => bkend.collection('items').find(filters),
});

// Mutation
const mutation = useMutation({
  mutationFn: (newItem) => bkend.collection('items').create(newItem),
  onSuccess: () => {
    queryClient.invalidateQueries(['items']);
  },
});
```

### Protected Routes
```typescript
// Wrap protected pages with auth check
'use client';
export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!user) redirect('/login');
  return <>{children}</>;
}
```

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Get bkend.ai credentials:
   - Sign up at https://bkend.ai
   - Create a new project
   - Copy API Key and Project ID
3. Fill in `.env.local`:
   ```
   NEXT_PUBLIC_BKEND_API_KEY=your_api_key
   NEXT_PUBLIC_BKEND_PROJECT_ID=your_project_id
   ```

## MCP Configuration

bkend.ai MCP server is configured in `.mcp.json`:
- Provides AI access to backend operations
- Auto-discovers collections and schemas
- Enables intelligent API suggestions

## PDCA Workflow

This project follows bkit's PDCA (Plan-Do-Check-Act) methodology:

1. **Plan** (`/pdca plan <feature>`): Define feature requirements
2. **Design** (`/pdca design <feature>`): Create technical specifications
3. **Do** (Implementation): Build the feature
4. **Check** (`/pdca analyze <feature>`): Gap analysis between design and implementation
5. **Act** (`/pdca iterate <feature>`): Iterate based on findings

Documents are stored in `docs/` with proper versioning.

## Common Tasks

### Adding a New Feature
```bash
# 1. Plan the feature
/pdca plan user-profile

# 2. Create design document
/pdca design user-profile

# 3. Implement (Do phase)
# ... write code ...

# 4. Analyze implementation
/pdca analyze user-profile

# 5. Generate completion report
/pdca report user-profile
```

### Adding a New Collection (Database Table)
1. Define schema in design document
2. Create TypeScript types in `types/`
3. Access via `bkend.collection('collectionName')`
4. Collections are auto-created on first use

### Adding Authentication to a Route
1. Create route in `app/(main)/` directory
2. Wrap page with `<ProtectedRoute>` component
3. Access current user via `useAuth()` hook

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Use `'use client'` directive for client components only
- Prefer server components when possible
- Use Tailwind CSS for styling (no CSS modules)

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Routes: lowercase with hyphens (e.g., `user-profile/page.tsx`)

### Component Organization
- Keep components small and focused
- Extract reusable UI to `components/ui/`
- Feature-specific components go in `components/features/`
- Use TypeScript interfaces for props

### State Management
- Server state: TanStack Query
- Global client state: Zustand
- Local component state: React useState
- Form state: React Hook Form (when needed)

## Limitations & When to Upgrade

**Current Limitations:**
- BaaS platform limits (check bkend.ai pricing)
- Serverless function constraints
- Limited backend logic customization

**Upgrade to Enterprise Level if you need:**
- Microservices architecture
- Custom infrastructure control
- High traffic scaling (100k+ concurrent users)
- Complex backend business logic
- Multi-region deployment

## Troubleshooting

### CORS Error
- Register your domain in bkend.ai console
- Check API key and project ID in `.env.local`

### 401 Unauthorized
- Token expired, user needs to re-login
- Implement token refresh logic if needed

### Data Not Showing
- Check collection name matches exactly
- Verify query filters and conditions
- Check browser console for API errors

### TypeScript Errors
- Sync types with actual data schemas
- Run `npm run build` to check all type errors
- Use proper type guards for nullable values

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [bkend.ai Documentation](https://bkend.ai/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [bkit Development Guide](https://github.com/popup-studio-ai/bkit-claude-code)
