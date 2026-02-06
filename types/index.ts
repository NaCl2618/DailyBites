/**
 * Common TypeScript type definitions
 */

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

export interface BaseDocument {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Recipe Types
export interface GeneratedRecipe {
  id?: string;
  title: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  cookingTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string; // "12-24개월"
  allergyWarnings: string[];
  imageUrl: string;
  imagePrompt: string;
  nutritionInfo?: NutritionInfo;
  createdAt?: Date;
}

export interface RecipeIngredient {
  name: string;
  amount: string; // "100g", "1개" 등
  isInputIngredient: boolean; // 사용자가 입력한 재료인지
}

export interface NutritionInfo {
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
}

export interface SavedRecipe extends GeneratedRecipe {
  _id: string;
  userId: string;
  userNote?: string;
  isFavorite?: boolean;
  updatedAt: Date;
}

// Ingredient Types
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  allergyRisk: boolean;
  minAge: number; // 최소 권장 월령
  keywords: string[]; // 검색용
}

export type IngredientCategory =
  | '채소'
  | '과일'
  | '곡류'
  | '단백질'
  | '유제품'
  | '기타';

// Recipe Generation Options
export interface RecipeGenerationOptions {
  ageRange?: '6-12' | '12-24' | '24+'; // 월령 (선택)
  cookingTime?: 'quick' | 'normal'; // 조리 시간
  excludeAllergies?: string[]; // 제외 알레르기
}
