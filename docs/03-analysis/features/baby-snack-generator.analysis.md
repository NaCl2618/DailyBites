# Baby Snack Generator - Gap Analysis Report

## Analysis Overview

- **Analysis Target**: baby-snack-generator
- **Design Document**: `docs/02-design/features/baby-snack-generator.design.md`
- **Implementation Path**: `app/`, `components/`, `lib/`
- **Analysis Date**: 2026-02-07
- **Project**: DailyBites (Dynamic Level)

---

## 📊 Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match | 42% | ❌ CRITICAL |
| Architecture Compliance | 65% | ⚠️ WARNING |
| Convention Compliance | 78% | ⚠️ WARNING |
| **Overall Match Rate** | **52%** | **❌ CRITICAL** |

---

## 1. API Endpoints Gap Analysis

### ❌ Design specified 5 API endpoints. Only 1 is implemented.

| Design Endpoint | Implementation | Status | Notes |
|----------------|----------------|:------:|-------|
| `POST /api/recipes/generate` | `app/api/recipes/generate/route.ts` | ✅ MATCH | Working, uses Gemini instead of OpenAI |
| `POST /api/recipes/save` | Not found | ❌ MISSING | No save route file exists |
| `GET /api/recipes` | Not found | ❌ MISSING | No recipe list route exists |
| `GET /api/recipes/[id]` | Not found | ❌ MISSING | No recipe detail route exists |
| `DELETE /api/recipes/[id]` | Not found | ❌ MISSING | No recipe delete route exists |

**API Match Rate: 1/5 = 20%**

### ⚠️ API Response Format Differences

For the implemented endpoint (`POST /api/recipes/generate`):

| Item | Design | Implementation | Status |
|------|--------|----------------|:------:|
| Success response | `{ success: true, data, usage }` | `{ success: true, data }` | ⚠️ CHANGED - `usage` field missing |
| Error response | `{ success: false, error: { code, message } }` | `{ error: string }` | ⚠️ CHANGED - error is string, not object |
| Error codes | GENERATION_FAILED, INVALID_INPUT, RATE_LIMIT | No error codes used | ❌ MISSING |

---

## 2. Route / Page Structure Gap Analysis

| Design Route | Implementation | Status | Notes |
|-------------|----------------|:------:|-------|
| `/` (Landing page) | `app/page.tsx` | ✅ MATCH | Hero, Features, How It Works sections present |
| `/generate` | `app/generate/page.tsx` | ✅ MATCH | Ingredient input + options + generation flow |
| `/login` | Not found | ❌ MISSING | No `app/(auth)/login/page.tsx` |
| `/register` | Not found | ❌ MISSING | No `app/(auth)/register/page.tsx` |
| `/dashboard` | Not found | ❌ MISSING | No `app/(main)/dashboard/page.tsx` |
| `/my-recipes` | Not found | ❌ MISSING | No `app/(main)/my-recipes/page.tsx` |
| `/my-recipes/[id]` | Not found | ❌ MISSING | No recipe detail page |
| `/recipe/[id]` | Not found | ❌ MISSING | No public recipe view page |

**Route Match Rate: 2/8 = 25%**

---

## 3. Component Structure Gap Analysis

### Feature Components

| Design Component | Implementation File | Status | Notes |
|-----------------|---------------------|:------:|-------|
| `IngredientInput.tsx` | `components/features/recipe-generator/IngredientInput.tsx` | ✅ MATCH | Props and features match design |
| `RecipeOptions.tsx` | `components/features/recipe-generator/RecipeOptions.tsx` | ✅ MATCH | Props match, excludeAllergies option not rendered |
| `GenerationLoading.tsx` | `components/features/recipe-generator/GenerationLoading.tsx` | ✅ MATCH | Progress steps, tips rotation working |
| `RecipeResult.tsx` | `components/features/recipe-generator/RecipeResult.tsx` | ✅ MATCH | Props match design spec |
| `RecipeCard.tsx` (for list) | Not found | ❌ MISSING | No RecipeCard for my-recipes list |
| `LoginForm.tsx` | Not found | ❌ MISSING | No auth form components |
| `RegisterForm.tsx` | Not found | ❌ MISSING | No auth form components |

### Layout Components

| Design Component | Implementation File | Status | Notes |
|-----------------|---------------------|:------:|-------|
| `Header.tsx` | Not found | ❌ MISSING | Header is inline in generate page, not extracted |
| `Footer.tsx` | Not found | ❌ MISSING | Footer is inline in landing page, not extracted |
| `Sidebar.tsx` (optional) | Not found | ❌ MISSING | - |

### Shared Components

| Design Component | Implementation File | Status | Notes |
|-----------------|---------------------|:------:|-------|
| `ProtectedRoute.tsx` | `components/ProtectedRoute.tsx` | ⚠️ CHANGED | Location differs: design says `components/shared/`, actual is `components/` |
| `LoadingSpinner.tsx` | Not found | ❌ MISSING | No separate loading spinner component |
| `ErrorBoundary.tsx` | Not found | ❌ MISSING | No error boundary component |

### UI Components (shadcn/ui)

| Design Component | Implementation File | Status |
|-----------------|---------------------|:------:|
| `button.tsx` | `components/ui/button.tsx` | ✅ MATCH |
| `input.tsx` | `components/ui/input.tsx` | ✅ MATCH |
| `card.tsx` | `components/ui/card.tsx` | ✅ MATCH |
| `badge.tsx` | `components/ui/badge.tsx` | ✅ MATCH |
| `dialog.tsx` | `components/ui/dialog.tsx` | ✅ MATCH |
| `toast.tsx` | `components/ui/toast.tsx` | ✅ MATCH |
| `skeleton.tsx` | `components/ui/skeleton.tsx` | ✅ MATCH |
| `dropdown-menu` | Not found | ❌ MISSING |

**Component Match Rate: 11/17 = 65%**

---

## 4. Data Model Gap Analysis

| Design Entity | Implementation File | Status | Notes |
|--------------|---------------------|:------:|-------|
| `GeneratedRecipe` | `types/index.ts` | ✅ MATCH | All fields match design |
| `RecipeIngredient` | `types/index.ts` | ✅ MATCH | All fields match |
| `NutritionInfo` | `types/index.ts` | ✅ MATCH | All fields match |
| `SavedRecipe` | `types/index.ts` | ✅ MATCH | All fields match, but no DB usage yet |
| `Ingredient` | `types/index.ts` | ✅ MATCH | All fields match |
| `IngredientCategory` | `types/index.ts` | ✅ MATCH | All categories match |
| `User` | `types/index.ts` | ⚠️ PARTIAL | Present but uses `_id` vs `id` in hooks |
| `UserPreferences` | `types/index.ts` | ✅ MATCH | Present but unused |
| `RecipeGenerationOptions` | `types/index.ts` | ✅ MATCH | All fields match |

**Data Model Match Rate: 9/9 = 100%**

⚠️ Note: The `User` type in `types/index.ts` uses `_id: string` per design, but `hooks/useAuth.ts` defines a local `User` with `id: string` (no underscore) -- this is an inconsistency.

---

## 5. AI Integration Gap Analysis

| Design Item | Implementation | Status | Impact |
|------------|----------------|:------:|--------|
| OpenAI GPT-4 Turbo for recipe | Google Gemini 2.5 Flash | 🔄 CHANGED | ⚠️ High - Different AI provider entirely |
| OpenAI DALL-E 3 for images | Unsplash static image mapping | 🔄 CHANGED | ⚠️ High - No AI image generation |
| `lib/api/openai.ts` | `lib/api/gemini.ts` | 🔄 CHANGED | File renamed and provider changed |
| Image upload to bkend.ai storage | Not implemented | ❌ MISSING | No image upload logic |
| `lib/constants/prompts.ts` | Prompts inline in `gemini.ts` | 🔄 CHANGED | Prompts not separated |
| Recipe caching strategy | Not implemented | ❌ MISSING | No `generateRecipeWithCache` function |
| `response_format: { type: 'json_object' }` | Manual JSON parsing | 🔄 CHANGED | Different JSON handling approach |

---

## 6. State Management Gap Analysis

| Design Item | Implementation | Status | Notes |
|------------|----------------|:------:|-------|
| Auth Store (Zustand) | `hooks/useAuth.ts` | ✅ MATCH | Structure matches design |
| `useRecipeGenerator` hook (TanStack Query) | Not found | ❌ MISSING | Generate page uses raw `useState` + `fetch` |
| `useRecipes` hook (TanStack Query) | Not found | ❌ MISSING | No recipe list query hook |
| `useSaveRecipe` hook | Not found | ❌ MISSING | Save is a TODO stub |
| `useDeleteRecipe` hook | Not found | ❌ MISSING | No delete hook |
| `lib/stores/auth-store.ts` | Auth store in `hooks/useAuth.ts` | 🔄 CHANGED | Location differs from design |

**State Management Match Rate: 1/6 = 17%**

---

## 7. Security & Infrastructure Gap Analysis

| Design Item | Implementation | Status | Impact |
|------------|----------------|:------:|--------|
| Rate limiting (Upstash Redis) | Not implemented | ❌ MISSING | ⚠️ High - No rate limits on AI generation |
| Zod validation schemas | Not implemented | ❌ MISSING | ⚠️ Medium - No server/client validation |
| Error classes (AppError, etc.) | Not implemented | ❌ MISSING | Medium - Using generic Error |
| XSS Prevention (DOMPurify) | Not implemented | ❌ MISSING | Low - No user-generated HTML currently |
| CSRF Protection | Not implemented | ❌ MISSING | Low - No forms submitting to server |
| `OPENAI_API_KEY` env var | `GEMINI_API_KEY` used instead | 🔄 CHANGED | AI provider changed |
| `.env.local.example` | `.env.local copy.example` exists | 🔄 CHANGED | Filename has space, non-standard |

---

## 8. Performance Optimization Gap Analysis

| Design Item | Implementation | Status | Notes |
|------------|----------------|:------:|-------|
| Image optimization (Next.js Image) | Uses `<Image>` in RecipeResult | ✅ MATCH | `priority` and `fill` used |
| Image formats (WebP, AVIF) | Not configured in `next.config.ts` | ❌ MISSING | No `formats` specified |
| Code splitting (dynamic import) | Not implemented | ❌ MISSING | No dynamic imports |
| API response caching (`revalidate`) | Not implemented | ❌ MISSING | No revalidation config |
| Lazy loading (Intersection Observer) | Not implemented | ❌ MISSING | No lazy loading for recipe cards |
| Remote patterns for images | `next.config.ts` | ✅ MATCH | Unsplash + DALL-E hostnames configured |

---

## 9. Dependencies Gap Analysis

| Design Dependency | Installed | Status | Notes |
|------------------|:---------:|:------:|-------|
| `@tanstack/react-query` | ✅ Yes | ⚠️ WARNING | Installed but not used in code |
| `zustand` | ✅ Yes | ✅ MATCH | Used in useAuth |
| `openai` | ✅ Yes | ⚠️ WARNING | Installed but not used (Gemini used instead) |
| `react-hook-form` | ✅ Yes | ⚠️ WARNING | Installed but not used anywhere |
| `zod` | ✅ Yes | ⚠️ WARNING | Installed but no validation schemas created |
| `sonner` | ✅ Yes | ⚠️ WARNING | Installed but toast not used (using `alert()`) |
| `@google/generative-ai` | ✅ Yes | ➕ ADDED | Not in design, added for Gemini |
| `lucide-react` | ✅ Yes | ✅ MATCH | Used |
| `class-variance-authority` | ✅ Yes | ✅ MATCH | Used in UI components |
| `clsx` + `tailwind-merge` | ✅ Yes | ✅ MATCH | Used in `cn()` utility |

---

## 10. Convention Compliance

### 10.1 Naming Convention

| Category | Convention | Compliance | Violations |
|----------|-----------|:----------:|------------|
| Components | PascalCase | 100% | None |
| Functions | camelCase | 100% | None |
| Files (component) | PascalCase.tsx | 100% | None |
| Files (utility) | camelCase.ts | 100% | None |
| Hooks | camelCase with `use` prefix | 90% | `use-toast.ts` uses kebab-case |
| Folders | kebab-case | 100% | None |

### 10.2 Folder Structure (Dynamic Level)

| Expected Path | Exists | Status | Notes |
|--------------|:------:|:------:|-------|
| `components/` | ✅ Yes | ✅ MATCH | |
| `components/ui/` | ✅ Yes | ✅ MATCH | |
| `components/features/` | ✅ Yes | ✅ MATCH | |
| `components/layout/` | ❌ No | ❌ MISSING | Header/Footer not extracted |
| `components/shared/` | ❌ No | ❌ MISSING | ProtectedRoute in wrong location |
| `lib/` | ✅ Yes | ✅ MATCH | |
| `lib/api/` | ✅ Yes | 🔄 CHANGED | Contains `gemini.ts` instead of `openai.ts` |
| `lib/hooks/` | ❌ No | 🔄 CHANGED | Hooks at root `hooks/` instead |
| `lib/stores/` | ❌ No | 🔄 CHANGED | Auth store in `hooks/useAuth.ts` |
| `lib/utils/` | ❌ No | 🔄 CHANGED | Utils at `lib/utils.ts` (flat) |
| `lib/constants/` | ✅ Yes | ✅ MATCH | Has `ingredients.ts` and `mock-recipe.ts` |
| `types/` | ✅ Yes | ✅ MATCH | |
| `hooks/` | ✅ Yes | ➕ ADDED | Not in design structure |

---

## 📈 Match Rate Summary

```
Overall Match Rate: 52%

Category Breakdown:
  API Endpoints:         20%  (1/5 implemented)
  Routes/Pages:          25%  (2/8 implemented)
  Components:            65%  (11/17 implemented)
  Data Models:          100%  (9/9 match)
  State Management:      17%  (1/6 implemented)
  AI Integration:        30%  (major provider change)
  Security/Infra:        10%  (almost nothing implemented)
  Performance:           33%  (2/6 items)
  Dependencies:          70%  (installed but many unused)
  Convention:            78%  (mostly compliant)
```

---

## 🔍 Differences Found

### ❌ MISSING Features (24 items)

**Critical (P0) - Blocks Core Features:**
1. Login page (`app/(auth)/login/page.tsx`)
2. Register page (`app/(auth)/register/page.tsx`)
3. POST /api/recipes/save - Save recipe API
4. GET /api/recipes - Recipe list API

**High Priority (P1) - Major Features:**
5. Dashboard page (`app/(main)/dashboard/page.tsx`)
6. My Recipes page (`app/(main)/my-recipes/page.tsx`)
7. Recipe detail page (`app/(main)/my-recipes/[id]/page.tsx`)
8. GET /api/recipes/[id] - Recipe detail API
9. DELETE /api/recipes/[id] - Recipe delete API
10. LoginForm component
11. RegisterForm component
12. RecipeCard component (for list)

**Medium Priority (P2) - Code Quality:**
13. useRecipeGenerator hook (TanStack Query)
14. useRecipes hook (TanStack Query)
15. Zod validation schemas (`lib/utils/validation.ts`)
16. Error classes (AppError hierarchy)
17. Header component (extracted)
18. Footer component (extracted)

**Low Priority (P3) - Optional/Future:**
19. Public recipe view (`app/recipe/[id]/page.tsx`)
20. LoadingSpinner component
21. ErrorBoundary component
22. Rate limiting (Upstash Redis)
23. Recipe caching strategy
24. Prompt constants file (`lib/constants/prompts.ts`)

### ➕ ADDED Features (3 items)

1. **Google Gemini integration** (`lib/api/gemini.ts`) - Replaced OpenAI
2. **Mock recipe data** (`lib/constants/mock-recipe.ts`) - Test data for UI
3. **Unsplash image mapping** (`lib/api/gemini.ts`) - Static images instead of DALL-E

### 🔄 CHANGED Features (10 items)

| # | Item | Design | Implementation | Impact |
|---|------|--------|----------------|:------:|
| 1 | AI Provider | OpenAI GPT-4 Turbo + DALL-E 3 | Google Gemini 2.5 Flash + Unsplash | ⚠️ High |
| 2 | Image generation | DALL-E 3 AI generation | Static Unsplash URL mapping | ⚠️ High |
| 3 | Error response format | `{ error: { code, message } }` | `{ error: string }` | Medium |
| 4 | API response `usage` field | Included `{ tokensUsed, cost }` | Not included | Low |
| 5 | Auth store location | `lib/stores/auth-store.ts` | `hooks/useAuth.ts` | Low |
| 6 | Hooks location | `lib/hooks/` | Root `hooks/` directory | Low |
| 7 | User type `_id` vs `id` | `_id: string` in types | `id: string` in useAuth | Medium |
| 8 | ProtectedRoute location | `components/shared/` | `components/` | Low |
| 9 | Toast notifications | Sonner library | Uses `alert()` calls | Medium |
| 10 | Color configuration | Explicit hex scales | CSS variables (shadcn) | Low |

---

## 🎯 Recommended Actions

### 🚨 Immediate Actions (Critical) - Next 2-3 days

| Priority | Item | Impact | Effort |
|:--------:|------|--------|:------:|
| **P0-1** | **Decide on AI provider**: Update design to reflect Gemini or implement OpenAI | Design-code sync | Low |
| **P0-2** | Implement `POST /api/recipes/save` route | Core feature blocked | Medium |
| **P0-3** | Create Login/Register pages and auth forms | Core feature blocked | Medium |
| **P0-4** | Implement structured error response format | API consistency | Low |

### ⚡ Short-term Actions (1 week)

| Priority | Item | Impact | Effort |
|:--------:|------|--------|:------:|
| **P1-1** | Create `useRecipeGenerator` hook using TanStack Query mutation | Architecture compliance | Low |
| **P1-2** | Create `GET /api/recipes` and `GET /api/recipes/[id]` routes | My Recipes feature | Medium |
| **P1-3** | Build My Recipes page (`app/(main)/my-recipes/`) | User feature completeness | Medium |
| **P1-4** | Create Dashboard page | User feature completeness | Medium |
| **P1-5** | Add Zod validation schemas (`lib/utils/validation.ts`) | Input safety | Low |
| **P1-6** | Replace `alert()` calls with Sonner toast notifications | UX quality | Low |
| **P1-7** | Extract Header/Footer as reusable layout components | Code organization | Low |

### 📋 Long-term Actions (Backlog)

| Item | Impact | Notes |
|------|--------|-------|
| Implement rate limiting (Upstash or alternative) | Security | Prevents API abuse |
| Add recipe caching strategy | Cost optimization | Reduces AI API costs |
| Create ErrorBoundary component | Resilience | Graceful error handling |
| Implement public recipe sharing (`/recipe/[id]`) | Feature completeness | Social sharing |
| Add real image generation (DALL-E or Gemini Imagen) | UX quality | Replace Unsplash placeholders |
| Create error class hierarchy | Code quality | Structured error handling |

---

## 📝 Design Document Updates Needed

If the implementation direction is accepted as-is, the following design document changes are required:

1. **Update Section 2.2**: Replace OpenAI with Google Gemini AI as the AI provider
2. **Update Section 5.2**: Replace OpenAI API client with Gemini API client code
3. **Update Section 8.1**: Recalculate cost estimates for Gemini pricing
4. **Update Section 3.1**: Adjust `lib/api/openai.ts` to `lib/api/gemini.ts`
5. **Add `@google/generative-ai`** to Section 14 dependencies
6. **Update Section 15**: Change `OPENAI_API_KEY` to `GEMINI_API_KEY`
7. **Document image approach**: Explain Unsplash fallback (or update plan for AI image generation)

---

## 🔄 Synchronization Options

Given the 52% match rate, the following options are available:

### Option 1: Modify implementation to match design
- Implement all missing features (login, register, dashboard, my-recipes, all API routes, hooks, rate limiting)
- **Pros**: Full design compliance, complete feature set
- **Cons**: High effort, delays MVP

### Option 2: Update design to match implementation
- Document the Gemini pivot, remove or defer unimplemented features to a later phase
- **Pros**: Fast MVP delivery, design-code sync
- **Cons**: Incomplete feature set, potential tech debt

### Option 3: Integrate both ⭐ **RECOMMENDED**
- Update design for intentional changes (Gemini, Unsplash)
- Implement remaining missing core features (auth, recipe CRUD, hooks)
- **Pros**: Pragmatic MVP, clean architecture, clear roadmap
- **Cons**: Requires prioritization

### Option 4: Record differences as intentional
- Mark AI provider change as intentional, defer Phase 3-4 features
- **Pros**: Accept current state, iterate later
- **Cons**: Technical debt accumulation

---

## ✅ Conclusion

**Overall Match Rate: 52% (CRITICAL)**

The core recipe generation flow works well (data models are 100% aligned, ingredient input/options/loading/result display functions correctly). However, significant gaps exist in:

- **4 of 5 API endpoints** are missing
- **6 of 8 routes/pages** are missing
- **AI provider was changed** from OpenAI to Gemini (intentional, but not documented)
- **No TanStack Query hooks** despite being installed
- **No security infrastructure** (rate limiting, validation, error handling)

**Recommendation**: Option 3 (Integrate both)
1. Update design document to reflect intentional AI provider change
2. Implement P0-P1 missing core features to reach functional MVP
3. Bring match rate above 90% before completion report

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-07 | Initial gap analysis | Claude Code (gap-detector) |
