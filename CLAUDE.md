# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DailyBites** is an AI-powered baby snack recipe generator built with Next.js and Google Gemini AI.

- **Purpose**: Generate safe and nutritious baby snack recipes based on available ingredients
- **Stack**: Next.js 15, TypeScript, Tailwind CSS, Google Gemini AI API
- **Key Features**: AI recipe generation, image selection, allergen warnings, nutrition information

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
│   ├── page.tsx           # Landing page
│   ├── generate/          # Recipe generation page
│   │   └── page.tsx       # Main recipe generator UI
│   ├── api/               # API routes
│   │   └── recipes/
│   │       └── generate/  # Recipe generation endpoint
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── components/             # React components
│   ├── ui/                # Basic UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── features/          # Feature-specific components
│       └── recipe-generator/
│           ├── IngredientInput.tsx    # Ingredient search/selection
│           ├── RecipeOptions.tsx      # Age range, cooking time options
│           ├── GenerationLoading.tsx  # Loading state
│           └── RecipeResult.tsx       # Display generated recipe
│
├── lib/                    # Utilities and configurations
│   ├── api/
│   │   └── gemini.ts      # Gemini AI integration
│   ├── constants/
│   │   └── ingredients.ts # Predefined ingredient database
│   └── utils.ts           # Helper functions (cn, etc.)
│
├── types/                  # TypeScript type definitions
│   └── index.ts           # Recipe, Ingredient types
│
└── docs/                   # PDCA documentation
    ├── 01-plan/           # Planning documents
    ├── 02-design/         # Design specifications
    ├── 03-analysis/       # Gap analysis reports
    └── 04-report/         # Completion reports
```

## Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React useState (local state only, no global store yet)
- **Type Safety**: TypeScript strict mode
- **UI Components**: shadcn/ui (Radix UI primitives)

### Backend (API Routes)
- **Platform**: Next.js API Routes (serverless functions)
- **AI Service**: Google Gemini AI (gemini-2.5-flash model)
- **Image Source**: Unsplash curated images (mapped by ingredients)
- **Runtime**: Node.js (runtime = 'nodejs', maxDuration = 60s)

### Recipe Generation Flow
1. User selects ingredients from predefined database (lib/constants/ingredients.ts)
2. User optionally selects age range (6-12, 12-24, 24+) and cooking time preference
3. Frontend sends POST request to `/api/recipes/generate`
4. Backend calls Gemini AI to generate recipe JSON (title, steps, ingredients, nutrition, allergens)
5. Backend selects appropriate Unsplash image based on main ingredients
6. Frontend displays complete recipe with image, ingredients, steps, and warnings

### Gemini AI Integration Pattern
```typescript
// lib/api/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateRecipeWithGemini(
  ingredients: string[],
  options: RecipeGenerationOptions = {}
): Promise<Omit<GeneratedRecipe, 'imageUrl' | 'imagePrompt'>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = createRecipePrompt(ingredients, options);
  const result = await model.generateContent(prompt);
  // ... parse JSON response
}
```

## Key Patterns

### API Route Structure (Recipe Generation)
```typescript
// app/api/recipes/generate/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60; // Maximum 60 seconds

export async function POST(request: NextRequest) {
  const { ingredients, options } = await request.json();

  // 1. Generate recipe with Gemini
  const recipeData = await generateRecipeWithGemini(ingredients, options);

  // 2. Select image based on ingredients
  const imageUrl = await generateImageWithGemini(recipeData.title, mainIngredients);

  // 3. Return complete recipe
  return NextResponse.json({ success: true, data: recipe });
}
```

### Ingredient Database Pattern
```typescript
// lib/constants/ingredients.ts
export const INGREDIENTS: Ingredient[] = [
  {
    id: 'banana',
    name: '바나나',
    category: '과일',
    allergyRisk: false,
    minAge: 6,
    keywords: ['banana', '바나나', 'バナナ']
  },
  // ... more ingredients
];
```

### Type Definitions
```typescript
// types/index.ts
export interface GeneratedRecipe {
  title: string;
  ingredients: RecipeIngredient[];  // name, amount, isInputIngredient
  steps: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  allergyWarnings: string[];
  imageUrl: string;
  nutritionInfo?: NutritionInfo;
}
```

## Environment Setup

1. Copy `.env.local copy.example` to `.env.local`
2. Get Google Gemini API key:
   - Visit https://aistudio.google.com/apikey
   - Create API key
3. Fill in `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## PDCA Workflow

This project follows bkit's PDCA (Plan-Do-Check-Act) methodology:

1. **Plan** (`/pdca plan <feature>`): Define feature requirements
2. **Design** (`/pdca design <feature>`): Create technical specifications
3. **Do** (Implementation): Build the feature
4. **Check** (`/pdca analyze <feature>`): Gap analysis between design and implementation
5. **Act** (`/pdca iterate <feature>`): Iterate based on findings

Documents are stored in `docs/` with proper versioning.

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Use `'use client'` directive for client components only
- Prefer server components when possible
- Use Tailwind CSS for styling (no CSS modules)

### File Naming
- Components: PascalCase (e.g., `RecipeResult.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useToast.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Routes: lowercase with hyphens (e.g., `generate/page.tsx`)

### Component Organization
- Keep components small and focused
- Extract reusable UI to `components/ui/` (shadcn/ui)
- Feature-specific components go in `components/features/recipe-generator/`
- Use TypeScript interfaces for props

### AI Prompt Engineering
- Prompts are in `lib/api/gemini.ts` (createRecipePrompt function)
- Always request JSON-only responses from Gemini
- Include age-appropriate safety guidelines in prompts
- Specify allergen warning requirements
- Handle both ```json``` and raw JSON responses

## Troubleshooting

### Gemini API Errors
- Check `GEMINI_API_KEY` in `.env.local`
- Verify API key has quota remaining (free tier limits apply)
- Check Gemini AI Studio console for usage limits

### JSON Parsing Errors
- Gemini sometimes wraps response in ```json ... ```
- Current code handles both formats (see lib/api/gemini.ts line 180-186)

### Missing Images
- Images come from Unsplash (no API key required)
- Fallback to random baby food image if ingredient not found
- Check ingredient mapping in lib/api/gemini.ts (line 96-117)

### TypeScript Errors
- Run `npm run build` to check all type errors
- Keep types/index.ts in sync with Gemini response format
- Use proper type guards for nullable values

## Future Enhancements (Not Yet Implemented)

- User authentication and saved recipes
- Recipe history and favorites
- Social sharing features
- Custom ingredient additions
- Meal planning features

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [bkit Development Guide](https://github.com/popup-studio-ai/bkit-claude-code)
