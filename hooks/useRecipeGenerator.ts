/**
 * Recipe Generation Hook
 *
 * TanStack Query mutation hook for generating recipes
 *
 * Usage:
 * const { mutate, isPending, data } = useRecipeGenerator();
 * mutate({ ingredients: ['바나나', '아보카도'], options: { ageRange: '12-24' } });
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { GeneratedRecipe, RecipeGenerationOptions } from '@/types';

interface GenerateRecipeRequest {
  ingredients: string[];
  options?: RecipeGenerationOptions;
}

interface GenerateRecipeResponse {
  success: boolean;
  data: GeneratedRecipe;
}

export function useRecipeGenerator() {
  return useMutation<GenerateRecipeResponse, Error, GenerateRecipeRequest>({
    mutationFn: async ({ ingredients, options }) => {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          ageRange: options?.ageRange,
          cookingTime: options?.cookingTime,
          excludeAllergies: options?.excludeAllergies,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '레시피 생성에 실패했습니다');
      }

      return response.json();
    },
    onError: (error) => {
      console.error('[Recipe Generation] Error:', error);
    },
  });
}
