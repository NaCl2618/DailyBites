# Design: Baby Snack Recipe Generator

**Feature ID**: baby-snack-generator
**Created**: 2026-02-06
**Status**: Design
**Version**: 1.0
**Plan Document**: [baby-snack-generator.plan.md](../../01-plan/features/baby-snack-generator.plan.md)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Component Structure](#3-component-structure)
4. [Data Models](#4-data-models)
5. [API Design](#5-api-design)
6. [State Management](#6-state-management)
7. [Routing & Navigation](#7-routing--navigation)
8. [AI Integration](#8-ai-integration)
9. [UI/UX Specifications](#9-uiux-specifications)
10. [Performance Optimization](#10-performance-optimization)
11. [Security Considerations](#11-security-considerations)
12. [Error Handling](#12-error-handling)
13. [Implementation Order](#13-implementation-order)

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │   Pages    │  │ Components  │  │  State (Zustand) │     │
│  │  (Routes)  │←→│   (UI/UX)   │←→│  + TanStack      │     │
│  └────────────┘  └─────────────┘  │     Query        │     │
│         ↓                          └──────────────────┘     │
│  ┌─────────────────────────────────────────────────┐        │
│  │            API Layer (lib/)                     │        │
│  │  - bkend.ts (BaaS client)                      │        │
│  │  - openai.ts (AI client)                       │        │
│  │  - utils.ts (Helpers)                          │        │
│  └─────────────────────────────────────────────────┘        │
└───────────────────┬─────────────────┬───────────────────────┘
                    │                 │
         ┌──────────▼─────┐  ┌────────▼─────────┐
         │  bkend.ai BaaS │  │  OpenAI API      │
         │  - Database    │  │  - GPT-4 Turbo   │
         │  - Auth        │  │  - DALL-E 3      │
         │  - Storage     │  │                  │
         └────────────────┘  └──────────────────┘
```

### 1.2 Data Flow

**Recipe Generation Flow:**

```
사용자 재료 입력
    ↓
IngredientInput 컴포넌트
    ↓
generateRecipe() API 호출
    ↓
┌─────────────────────────────┐
│ Server Action / API Route   │
│ 1. 재료 검증                │
│ 2. OpenAI GPT-4 호출        │
│ 3. 레시피 JSON 파싱         │
│ 4. DALL-E 3 이미지 생성     │
│ 5. 이미지 업로드 (bkend)    │
│ 6. 레시피 객체 반환         │
└─────────────────────────────┘
    ↓
RecipeResult 컴포넌트에 표시
    ↓
[선택] 저장 버튼 클릭
    ↓
bkend.ai에 레시피 저장
```

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 15+ | App Router, SSR/SSG |
| Language | TypeScript | 5+ | Type safety |
| Styling | Tailwind CSS | 3.4+ | Utility-first CSS |
| UI Components | shadcn/ui | Latest | Pre-built components |
| Icons | Lucide React | Latest | Icon library |
| State (Global) | Zustand | 5+ | Auth, preferences |
| State (Server) | TanStack Query | 5+ | Data fetching, caching |
| Forms | React Hook Form | 7+ | Form validation |
| Validation | Zod | 3+ | Schema validation |
| Notifications | Sonner | Latest | Toast notifications |

### 2.2 Backend & APIs

| Service | Purpose | Pricing Model |
|---------|---------|---------------|
| bkend.ai | Database, Auth, Storage | Free tier: 10GB storage |
| OpenAI GPT-4 Turbo | Recipe generation | $0.01 / 1K tokens (input) |
| OpenAI DALL-E 3 | Image generation | $0.04 / image (1024x1024) |

### 2.3 Development & Build Tools

- **Package Manager**: npm
- **Linter**: ESLint
- **Formatter**: Prettier (via ESLint config)
- **Deployment**: Vercel (Next.js optimized)
- **Environment Variables**: `.env.local`

---

## 3. Component Structure

### 3.1 Directory Structure

```
app/
├── (auth)/                         # Auth layout group
│   ├── login/
│   │   └── page.tsx               # Login page
│   └── register/
│       └── page.tsx               # Register page
│
├── (main)/                         # Main layout group (protected)
│   ├── dashboard/
│   │   └── page.tsx               # User dashboard
│   ├── my-recipes/
│   │   ├── page.tsx               # Saved recipes list
│   │   └── [id]/
│   │       └── page.tsx           # Recipe detail
│   └── layout.tsx                 # Protected layout
│
├── generate/
│   └── page.tsx                   # Recipe generation page
│
├── recipe/
│   └── [id]/
│       └── page.tsx               # Public recipe view
│
├── layout.tsx                     # Root layout
├── page.tsx                       # Landing page
└── globals.css                    # Global styles

components/
├── ui/                            # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   └── ...
│
├── features/                      # Feature-specific components
│   ├── recipe-generator/
│   │   ├── IngredientInput.tsx   # Ingredient selection
│   │   ├── RecipeOptions.tsx     # Age/allergy options
│   │   ├── GenerationLoading.tsx # Loading state
│   │   ├── RecipeResult.tsx      # Result display
│   │   └── RecipeCard.tsx        # Recipe card (list)
│   │
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
│
├── layout/
│   ├── Header.tsx                 # Site header
│   ├── Footer.tsx                 # Site footer
│   └── Sidebar.tsx                # User sidebar (optional)
│
└── shared/
    ├── ProtectedRoute.tsx         # Auth guard
    ├── LoadingSpinner.tsx         # Loading indicator
    └── ErrorBoundary.tsx          # Error boundary

lib/
├── api/
│   ├── recipes.ts                 # Recipe API functions
│   ├── openai.ts                  # OpenAI integration
│   └── ingredients.ts             # Ingredient API
│
├── hooks/
│   ├── useAuth.ts                 # Auth hook (Zustand)
│   ├── useRecipeGenerator.ts     # Recipe generation logic
│   └── useRecipes.ts              # Recipes query hooks
│
├── stores/
│   └── auth-store.ts              # Auth Zustand store
│
├── utils/
│   ├── bkend.ts                   # bkend.ai client
│   ├── validation.ts              # Zod schemas
│   └── helpers.ts                 # Utility functions
│
└── constants/
    ├── ingredients.ts             # Ingredient master data
    └── prompts.ts                 # AI prompt templates

types/
└── index.ts                       # TypeScript types
```

### 3.2 Key Components

#### 3.2.1 IngredientInput Component

**Purpose**: 재료 입력 및 선택

**Props**:
```typescript
interface IngredientInputProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  maxIngredients?: number; // default: 10
}
```

**Features**:
- 자동완성 검색 (로컬 데이터)
- 재료 추가/삭제
- 최대 개수 제한
- 재료 태그 표시

#### 3.2.2 RecipeOptions Component

**Purpose**: 레시피 생성 옵션 설정

**Props**:
```typescript
interface RecipeOptionsProps {
  options: RecipeGenerationOptions;
  onOptionsChange: (options: RecipeGenerationOptions) => void;
}

interface RecipeGenerationOptions {
  ageRange?: '6-12' | '12-24' | '24+'; // 월령 (선택)
  cookingTime?: 'quick' | 'normal';    // 조리 시간
  excludeAllergies?: string[];         // 제외 알레르기
}
```

#### 3.2.3 GenerationLoading Component

**Purpose**: AI 생성 중 로딩 상태

**Features**:
- 프로그레스 표시
- 단계별 상태 (레시피 생성 중 → 이미지 생성 중)
- 재미있는 팁 표시
- 취소 버튼 (선택)

#### 3.2.4 RecipeResult Component

**Purpose**: 생성된 레시피 표시

**Props**:
```typescript
interface RecipeResultProps {
  recipe: GeneratedRecipe;
  onSave?: () => void;           // 저장 (로그인 사용자)
  onRegenerate?: () => void;     // 재생성
  onNewRecipe?: () => void;      // 새 레시피
  onShare?: () => void;          // 공유
}
```

**Layout**:
- 상단: 이미지 (전체 너비)
- 제목, 조리시간, 난이도, 월령
- 재료 리스트
- 조리 단계
- 알레르기 주의사항
- 액션 버튼

---

## 4. Data Models

### 4.1 TypeScript Interfaces

#### 4.1.1 Recipe (Generated)

```typescript
// types/index.ts

export interface GeneratedRecipe {
  id?: string;                    // 저장된 경우에만 존재
  title: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  cookingTime: number;            // 분 단위
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;               // "12-24개월"
  allergyWarnings: string[];
  imageUrl: string;
  imagePrompt: string;
  nutritionInfo?: NutritionInfo;
  createdAt?: Date;
}

export interface RecipeIngredient {
  name: string;
  amount: string;                 // "100g", "1개" 등
  isInputIngredient: boolean;     // 사용자가 입력한 재료인지
}

export interface NutritionInfo {
  calories: number;
  protein: number;                // g
  carbs: number;                  // g
  fat: number;                    // g
}
```

#### 4.1.2 Saved Recipe (Database)

```typescript
export interface SavedRecipe extends GeneratedRecipe {
  _id: string;
  userId: string;
  userNote?: string;              // 사용자 메모
  isFavorite?: boolean;           // 즐겨찾기
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4.1.3 Ingredient

```typescript
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  allergyRisk: boolean;
  minAge: number;                 // 최소 권장 월령
  keywords: string[];             // 검색용
}

export type IngredientCategory =
  | '채소'
  | '과일'
  | '곡류'
  | '단백질'
  | '유제품'
  | '기타';
```

#### 4.1.4 User (from bkend.ai)

```typescript
export interface User {
  _id: string;
  email: string;
  name?: string;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  favoriteIngredients?: string[];
  babyAgeMonths?: number;
  knownAllergies?: string[];
}
```

### 4.2 Zod Validation Schemas

```typescript
// lib/utils/validation.ts

import { z } from 'zod';

export const IngredientInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .min(1, '최소 1개의 재료를 입력해주세요')
    .max(10, '최대 10개까지 입력 가능합니다'),
  ageRange: z.enum(['6-12', '12-24', '24+']).optional(),
  cookingTime: z.enum(['quick', 'normal']).optional(),
  excludeAllergies: z.array(z.string()).optional(),
});

export type IngredientInputData = z.infer<typeof IngredientInputSchema>;

export const SaveRecipeSchema = z.object({
  recipe: z.object({
    title: z.string(),
    ingredients: z.array(z.any()),
    steps: z.array(z.string()),
    cookingTime: z.number(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    ageRange: z.string(),
    allergyWarnings: z.array(z.string()),
    imageUrl: z.string().url(),
    imagePrompt: z.string(),
  }),
  userNote: z.string().optional(),
});
```

---

## 5. API Design

### 5.1 API Routes (Next.js Server Actions)

#### 5.1.1 POST /api/recipes/generate

**Purpose**: 재료를 기반으로 레시피 생성

**Request Body**:
```typescript
{
  ingredients: string[];          // ["바나나", "아보카도"]
  ageRange?: string;              // "12-24"
  cookingTime?: string;           // "quick"
  excludeAllergies?: string[];    // ["땅콩", "우유"]
}
```

**Response**:
```typescript
{
  success: true,
  data: GeneratedRecipe,
  usage: {
    tokensUsed: number,
    cost: number
  }
}
```

**Error Response**:
```typescript
{
  success: false,
  error: {
    code: "GENERATION_FAILED" | "INVALID_INPUT" | "RATE_LIMIT",
    message: string
  }
}
```

#### 5.1.2 POST /api/recipes/save

**Purpose**: 생성된 레시피 저장 (로그인 사용자만)

**Request Body**:
```typescript
{
  recipe: GeneratedRecipe,
  userNote?: string
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    recipeId: string
  }
}
```

#### 5.1.3 GET /api/recipes

**Purpose**: 내 레시피 목록 조회 (로그인 사용자)

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 12)
- `search`: string (optional)
- `category`: string (optional)

**Response**:
```typescript
{
  success: true,
  data: {
    recipes: SavedRecipe[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

#### 5.1.4 GET /api/recipes/[id]

**Purpose**: 특정 레시피 상세 조회

**Response**:
```typescript
{
  success: true,
  data: SavedRecipe
}
```

#### 5.1.5 DELETE /api/recipes/[id]

**Purpose**: 레시피 삭제

**Response**:
```typescript
{
  success: true,
  message: "레시피가 삭제되었습니다"
}
```

### 5.2 OpenAI Integration

#### 5.2.1 Recipe Generation Prompt

```typescript
// lib/constants/prompts.ts

export const RECIPE_GENERATION_PROMPT = (
  ingredients: string[],
  ageRange?: string,
  cookingTime?: string
) => `
당신은 영유아 영양 전문가입니다. 다음 재료를 사용하여 아기 간식 레시피를 생성해주세요.

재료: ${ingredients.join(', ')}
${ageRange ? `적합 월령: ${ageRange}개월` : ''}
${cookingTime === 'quick' ? '조리 시간: 15분 이내 (빠른 레시피)' : '조리 시간: 30분 이내'}

다음 JSON 형식으로 레시피를 생성해주세요:

{
  "title": "레시피 제목 (예: 바나나 아보카도 퓨레)",
  "ingredients": [
    {
      "name": "재료명",
      "amount": "양 (예: 1개, 100g)",
      "isInputIngredient": true 또는 false
    }
  ],
  "steps": [
    "1단계 설명",
    "2단계 설명",
    "..."
  ],
  "cookingTime": 조리시간(분 단위, 숫자),
  "difficulty": "easy" | "medium" | "hard",
  "ageRange": "적합 월령 (예: 6-12개월, 12-24개월)",
  "allergyWarnings": ["알레르기 유발 가능 재료"],
  "nutritionInfo": {
    "calories": 숫자,
    "protein": 숫자,
    "carbs": 숫자,
    "fat": 숫자
  }
}

주의사항:
- 아기에게 안전한 재료만 사용
- 소금, 설탕 최소화
- 알레르기 유발 가능 재료는 반드시 allergyWarnings에 명시
- 조리 단계는 명확하고 구체적으로
- 입력된 재료는 가능한 모두 활용 (전부 사용할 필요는 없음)
`;

export const IMAGE_GENERATION_PROMPT = (recipeTitle: string, mainIngredients: string[]) =>
  `A beautiful, appetizing photo of ${recipeTitle}, baby food made with ${mainIngredients.join(', ')}, served in a cute baby bowl, soft lighting, warm color tone, food photography style, high quality, no text`;
```

#### 5.2.2 OpenAI API Client

```typescript
// lib/api/openai.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateRecipe(
  ingredients: string[],
  options: RecipeGenerationOptions = {}
): Promise<GeneratedRecipe> {
  try {
    // 1. Generate recipe with GPT-4 Turbo
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: '당신은 영유아 영양 전문가입니다.',
        },
        {
          role: 'user',
          content: RECIPE_GENERATION_PROMPT(
            ingredients,
            options.ageRange,
            options.cookingTime
          ),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const recipeData = JSON.parse(completion.choices[0].message.content || '{}');

    // 2. Generate image with DALL-E 3
    const mainIngredients = ingredients.slice(0, 3); // 주요 재료 3개
    const imagePrompt = IMAGE_GENERATION_PROMPT(recipeData.title, mainIngredients);

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = imageResponse.data[0].url!;

    // 3. Upload image to bkend.ai storage
    const uploadedImageUrl = await uploadImageToBkend(imageUrl);

    return {
      ...recipeData,
      imageUrl: uploadedImageUrl,
      imagePrompt,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Recipe generation failed:', error);
    throw new Error('레시피 생성에 실패했습니다. 다시 시도해주세요.');
  }
}

async function uploadImageToBkend(imageUrl: string): Promise<string> {
  // Download image from DALL-E URL
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Upload to bkend.ai storage
  // TODO: Implement bkend.ai file upload
  // For now, return the original URL
  return imageUrl;
}
```

---

## 6. State Management

### 6.1 Zustand Stores

#### 6.1.1 Auth Store

```typescript
// lib/stores/auth-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // bkend.ai login
          const { user, token } = await bkend.auth.login({ email, password });
          set({ user, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await bkend.auth.register({ email, password, name });
          set({ user, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        bkend.auth.logout();
        set({ user: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

### 6.2 TanStack Query Hooks

#### 6.2.1 Recipe Generation Hook

```typescript
// lib/hooks/useRecipeGenerator.ts

import { useMutation } from '@tanstack/react-query';
import { generateRecipe } from '@/lib/api/openai';

export function useRecipeGenerator() {
  return useMutation({
    mutationFn: async (data: {
      ingredients: string[];
      options?: RecipeGenerationOptions;
    }) => {
      return await generateRecipe(data.ingredients, data.options);
    },
    onError: (error) => {
      console.error('Generation error:', error);
    },
  });
}
```

#### 6.2.2 Recipes Query Hook

```typescript
// lib/hooks/useRecipes.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useRecipes(filters?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: async () => {
      const response = await fetch(
        `/api/recipes?${new URLSearchParams(filters as any)}`
      );
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { recipe: GeneratedRecipe; userNote?: string }) => {
      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeId: string) => {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
```

---

## 7. Routing & Navigation

### 7.1 Route Structure

| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `/` | Public | No | Landing page |
| `/generate` | Public | No | Recipe generation |
| `/recipe/[id]` | Public | No | Public recipe view (shareable) |
| `/login` | Public | No | Login page |
| `/register` | Public | No | Register page |
| `/dashboard` | Protected | Yes | User dashboard |
| `/my-recipes` | Protected | Yes | Saved recipes list |
| `/my-recipes/[id]` | Protected | Yes | Saved recipe detail |

### 7.2 Navigation Flow

```
Landing (/)
    ↓
 "시작하기" 버튼
    ↓
Generate (/generate)
    ↓
 재료 입력 & 생성
    ↓
Recipe Result
    ↓
┌────────────┬────────────┐
│ 저장       │ 공유       │ 새 레시피
│ (로그인필요)│ (공용URL)  │ (재입력)
└────────────┴────────────┘
     ↓            ↓
  My Recipes   Recipe/[id]
  (보관함)      (공유뷰)
```

---

## 8. AI Integration

### 8.1 API Usage & Cost Estimation

#### 8.1.1 GPT-4 Turbo Usage

**Input Tokens** (per request):
- System prompt: ~50 tokens
- User prompt template: ~150 tokens
- Ingredients (3 items avg): ~20 tokens
- **Total Input**: ~220 tokens

**Output Tokens** (per response):
- Recipe JSON: ~400 tokens

**Cost per Generation**:
- Input: 220 tokens × $0.01 / 1K = $0.0022
- Output: 400 tokens × $0.03 / 1K = $0.012
- **Total**: ~$0.014 per recipe

#### 8.1.2 DALL-E 3 Usage

**Cost per Image**:
- 1024x1024, standard quality: $0.04
- **Total**: $0.04 per image

#### 8.1.3 Combined Cost

**Per Recipe Generation**: $0.014 (GPT-4) + $0.04 (DALL-E) = **$0.054**

**Monthly Cost Estimate** (1000 generations):
- 1000 generations × $0.054 = **$54/month**

### 8.2 Rate Limiting Strategy

```typescript
// lib/utils/rate-limit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Anonymous users: 3 requests/day
export const anonymousRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 d'),
  prefix: 'ratelimit:anon',
});

// Authenticated users: 10 requests/day
export const authenticatedRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 d'),
  prefix: 'ratelimit:auth',
});

export async function checkRateLimit(userId?: string) {
  const identifier = userId || 'anonymous';
  const limiter = userId ? authenticatedRateLimit : anonymousRateLimit;

  const { success, remaining } = await limiter.limit(identifier);

  if (!success) {
    throw new Error(
      userId
        ? '일일 생성 한도(10회)를 초과했습니다.'
        : '일일 생성 한도(3회)를 초과했습니다. 로그인하면 10회까지 가능합니다.'
    );
  }

  return remaining;
}
```

### 8.3 Caching Strategy

```typescript
// Cache similar ingredient combinations
// Example: ["바나나", "아보카도"] → cache for 1 hour

interface CacheEntry {
  recipe: GeneratedRecipe;
  expiresAt: Date;
}

const recipeCache = new Map<string, CacheEntry>();

function getCacheKey(ingredients: string[], options: RecipeGenerationOptions): string {
  const sorted = [...ingredients].sort().join(',');
  return `${sorted}:${JSON.stringify(options)}`;
}

export async function generateRecipeWithCache(
  ingredients: string[],
  options: RecipeGenerationOptions = {}
): Promise<GeneratedRecipe> {
  const cacheKey = getCacheKey(ingredients, options);
  const cached = recipeCache.get(cacheKey);

  if (cached && cached.expiresAt > new Date()) {
    console.log('Cache hit:', cacheKey);
    return cached.recipe;
  }

  const recipe = await generateRecipe(ingredients, options);

  recipeCache.set(cacheKey, {
    recipe,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  return recipe;
}
```

---

## 9. UI/UX Specifications

### 9.1 Color Palette

```typescript
// tailwind.config.ts

export default {
  theme: {
    extend: {
      colors: {
        // Primary (Peach/Orange)
        primary: {
          50: '#fff5f0',
          100: '#ffe5d9',
          200: '#ffccb3',
          300: '#ffb38c',
          400: '#ff9966',
          500: '#ff8040',  // Main
          600: '#e66629',
          700: '#cc4d1a',
          800: '#b3330d',
          900: '#991a00',
        },
        // Secondary (Green)
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Main
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Accent (Yellow)
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',  // Main
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
    },
  },
};
```

### 9.2 Typography

```typescript
// Font Scale
const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
};

// Font Family
const fontFamily = {
  sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-geist-mono)', 'monospace'],
};
```

### 9.3 Component Variants

#### 9.3.1 Button Variants

```tsx
<Button variant="primary" size="lg">
  레시피 생성하기
</Button>

// Variants:
// - primary: 주요 액션
// - secondary: 보조 액션
// - outline: 아웃라인
// - ghost: 텍스트만
// - destructive: 삭제 등

// Sizes:
// - sm, md, lg, xl
```

#### 9.3.2 Card Variants

```tsx
<Card variant="elevated" padding="lg">
  <RecipeCard recipe={recipe} />
</Card>

// Variants:
// - default: 기본 카드
// - elevated: 그림자 있음
// - bordered: 테두리만
```

### 9.4 Responsive Breakpoints

```typescript
const screens = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
};
```

### 9.5 Layout Specifications

#### 9.5.1 Landing Page

```
┌──────────────────────────────────────┐
│           Header (Navbar)             │
├──────────────────────────────────────┤
│                                       │
│         Hero Section                  │
│   타이틀, 설명, CTA 버튼              │
│                                       │
├──────────────────────────────────────┤
│                                       │
│      Features Section                 │
│   (3-column grid, icons + text)       │
│                                       │
├──────────────────────────────────────┤
│                                       │
│      How It Works                     │
│   (3-step process, visual)            │
│                                       │
├──────────────────────────────────────┤
│           Footer                      │
└──────────────────────────────────────┘
```

#### 9.5.2 Generate Page

```
┌──────────────────────────────────────┐
│           Header                      │
├──────────────────────────────────────┤
│                                       │
│    재료 입력 섹션                     │
│  ┌─────────────────────────────┐     │
│  │ 재료 검색 (자동완성)        │     │
│  └─────────────────────────────┘     │
│  [바나나] [아보카도] [고구마]        │
│                                       │
├──────────────────────────────────────┤
│                                       │
│    옵션 설정 (선택사항)              │
│  월령: [6-12] [12-24] [24+]          │
│  조리시간: [빠른] [보통]             │
│                                       │
├──────────────────────────────────────┤
│                                       │
│      [레시피 생성하기] 버튼          │
│                                       │
└──────────────────────────────────────┘
```

#### 9.5.3 Recipe Result Page

```
┌──────────────────────────────────────┐
│        Recipe Image                   │
│     (full width, 16:9 ratio)          │
├──────────────────────────────────────┤
│                                       │
│   바나나 아보카도 퓨레 🍌🥑         │
│   ⏱ 10분 | 🌟 쉬움 | 👶 6-12개월    │
│                                       │
├──────────────────────────────────────┤
│   재료                                │
│   • 바나나 1개                        │
│   • 아보카도 1/2개                    │
│                                       │
├──────────────────────────────────────┤
│   조리 단계                           │
│   1. 바나나를 으깬다                  │
│   2. 아보카도를 으깬다                │
│   3. 섞는다                           │
│                                       │
├──────────────────────────────────────┤
│   알레르기 주의 ⚠️                   │
│   • 아보카도 알레르기 주의            │
│                                       │
├──────────────────────────────────────┤
│  [💾 저장] [🔄 재생성] [📤 공유]    │
└──────────────────────────────────────┘
```

---

## 10. Performance Optimization

### 10.1 Image Optimization

```typescript
// next.config.ts
export default {
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'], // DALL-E
    formats: ['image/webp', 'image/avif'],
  },
};

// Usage
<Image
  src={recipe.imageUrl}
  alt={recipe.title}
  width={1024}
  height={1024}
  priority={true}
  placeholder="blur"
/>
```

### 10.2 Code Splitting

```typescript
// Dynamic imports for heavy components
const RecipeResult = dynamic(() => import('@/components/features/RecipeResult'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### 10.3 API Response Caching

```typescript
// app/api/recipes/route.ts
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // ... fetch recipes with cache
}
```

### 10.4 Lazy Loading

```typescript
// Intersection Observer for recipe cards
const RecipeCard = ({ recipe }: { recipe: SavedRecipe }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Image src={recipe.imageUrl} alt={recipe.title} />
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
```

---

## 11. Security Considerations

### 11.1 API Key Protection

```typescript
// .env.local
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_BKEND_API_KEY=...
NEXT_PUBLIC_BKEND_PROJECT_ID=...

// IMPORTANT: Never expose OPENAI_API_KEY to client
// All OpenAI calls must be server-side
```

### 11.2 Input Validation

```typescript
// Server-side validation for all API routes
export async function POST(request: Request) {
  const body = await request.json();

  // Validate with Zod
  const result = IngredientInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error },
      { status: 400 }
    );
  }

  // Process validated data
  const { ingredients, ageRange, cookingTime } = result.data;
  // ...
}
```

### 11.3 Rate Limiting

```typescript
// Apply rate limiting to all generation endpoints
export async function POST(request: Request) {
  const session = await getServerSession();
  const userId = session?.user?.id;

  try {
    const remaining = await checkRateLimit(userId);
    // ... proceed with generation
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 429 } // Too Many Requests
    );
  }
}
```

### 11.4 XSS Prevention

```typescript
// Sanitize user input before rendering
import DOMPurify from 'isomorphic-dompurify';

function SafeHTML({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### 11.5 CSRF Protection

```typescript
// Next.js API routes with NextAuth have built-in CSRF protection
// For custom forms, use CSRF tokens

import { getCsrfToken } from 'next-auth/react';

function Form() {
  const csrfToken = getCsrfToken();
  // Include in form submission
}
```

---

## 12. Error Handling

### 12.1 Error Types

```typescript
// lib/utils/errors.ts

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class GenerationError extends AppError {
  constructor(message: string) {
    super('GENERATION_FAILED', message, 500);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string) {
    super('RATE_LIMIT_EXCEEDED', message, 429);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '로그인이 필요합니다') {
    super('AUTH_REQUIRED', message, 401);
  }
}
```

### 12.2 Error Boundary

```typescript
// components/shared/ErrorBoundary.tsx

'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!);
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">문제가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg"
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 12.3 Toast Notifications

```typescript
// Using sonner for toast notifications

import { toast } from 'sonner';

// Success
toast.success('레시피가 저장되었습니다');

// Error
toast.error('레시피 생성에 실패했습니다');

// Loading
const toastId = toast.loading('레시피 생성 중...');
// ... after completion
toast.success('레시피가 생성되었습니다', { id: toastId });

// Custom
toast.custom((t) => (
  <div className="flex items-center gap-2">
    <span>일일 생성 한도가 초과되었습니다</span>
    <button onClick={() => toast.dismiss(t)}>닫기</button>
  </div>
));
```

---

## 13. Implementation Order

### Phase 1: Foundation (Week 1)

**Day 1-2: Project Setup & Core UI**
- [ ] Install dependencies (shadcn/ui, TanStack Query, Zustand)
- [ ] Set up Tailwind config with custom colors
- [ ] Create base UI components (Button, Card, Input, Badge)
- [ ] Create layout components (Header, Footer)
- [ ] Set up routing structure

**Day 3-4: Authentication**
- [ ] Implement bkend.ai authentication
- [ ] Create auth store (Zustand)
- [ ] Build login/register forms
- [ ] Create ProtectedRoute component
- [ ] Test auth flow

**Day 5-7: Ingredient Input UI**
- [ ] Create Ingredient master data (constants)
- [ ] Build IngredientInput component with autocomplete
- [ ] Build RecipeOptions component
- [ ] Create generate page layout
- [ ] Implement form validation (Zod)

### Phase 2: AI Integration (Week 2)

**Day 8-9: OpenAI Setup**
- [ ] Set up OpenAI API client
- [ ] Create prompt templates
- [ ] Implement generateRecipe function
- [ ] Test recipe generation (console output)
- [ ] Error handling for AI failures

**Day 10-11: Image Generation**
- [ ] Implement DALL-E 3 integration
- [ ] Create image upload to bkend.ai storage
- [ ] Test image generation
- [ ] Implement fallback for image failures

**Day 12-14: Generation Flow**
- [ ] Create useRecipeGenerator hook
- [ ] Build GenerationLoading component
- [ ] Implement rate limiting
- [ ] Add caching strategy
- [ ] End-to-end test (ingredient → result)

### Phase 3: Result Display & Save (Week 3)

**Day 15-17: Recipe Result UI**
- [ ] Build RecipeResult component
- [ ] Implement responsive layout
- [ ] Add action buttons (save, share, regenerate)
- [ ] Create share URL generation
- [ ] Image optimization

**Day 18-19: Save Feature**
- [ ] Create API route for saving recipes
- [ ] Implement useSaveRecipe hook
- [ ] Build "save success" notification
- [ ] Handle duplicate saves
- [ ] Test save flow

**Day 20-21: My Recipes Page**
- [ ] Create my-recipes page layout
- [ ] Build RecipeCard component
- [ ] Implement useRecipes hook
- [ ] Add pagination
- [ ] Create recipe detail page
- [ ] Add delete functionality

### Phase 4: Polish & Deploy (Week 4)

**Day 22-24: Testing & Bug Fixes**
- [ ] Integration testing (all flows)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Fix critical bugs
- [ ] Performance profiling

**Day 25-26: Optimization & SEO**
- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting optimization
- [ ] SEO meta tags
- [ ] Open Graph tags for sharing
- [ ] Sitemap generation

**Day 27-28: Deployment**
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Beta testing with 10 users
- [ ] Collect initial feedback

---

## 14. Dependencies to Install

```bash
# Core dependencies
npm install @tanstack/react-query zustand openai react-hook-form zod sonner

# UI dependencies
npm install lucide-react class-variance-authority clsx tailwind-merge

# shadcn/ui components (run individually)
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
npx shadcn@latest add skeleton

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
```

---

## 15. Environment Variables

```env
# .env.local

# OpenAI
OPENAI_API_KEY=sk-...

# bkend.ai
NEXT_PUBLIC_BKEND_API_KEY=your_api_key
NEXT_PUBLIC_BKEND_PROJECT_ID=your_project_id
BKEND_API_KEY=your_api_key
BKEND_PROJECT_ID=your_project_id

# Rate Limiting (optional, if using Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 16. Success Criteria

### 16.1 Functional Criteria

- [ ] 사용자가 재료를 입력하고 레시피를 생성할 수 있다
- [ ] 생성된 레시피에 적절한 이미지가 포함된다
- [ ] 로그인 사용자는 레시피를 저장하고 관리할 수 있다
- [ ] 레시피 공유 URL이 정상 작동한다
- [ ] 모바일에서 모든 기능이 정상 작동한다

### 16.2 Performance Criteria

- [ ] 레시피 생성 시간 < 45초 (평균)
- [ ] 페이지 로드 시간 < 3초 (FCP)
- [ ] 이미지 최적화로 로딩 시간 단축
- [ ] API 응답 시간 < 2초 (저장, 조회)

### 16.3 Quality Criteria

- [ ] TypeScript 타입 에러 0개
- [ ] ESLint 경고 0개
- [ ] 모든 API 엔드포인트에 에러 핸들링
- [ ] Rate limiting 정상 작동
- [ ] 캐싱 전략 적용

---

**Design Document Version**: 1.0
**Last Updated**: 2026-02-06
**Next Phase**: Do (Implementation)
