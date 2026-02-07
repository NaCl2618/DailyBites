/**
 * Recipe Query Hooks
 *
 * TanStack Query hooks for recipe CRUD operations
 *
 * Usage:
 * const { data, isLoading } = useRecipes();
 * const saveRecipe = useSaveRecipe();
 * const deleteRecipe = useDeleteRecipe();
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GeneratedRecipe, SavedRecipe } from '@/types';
import { useAuth } from './useAuth';

interface RecipesResponse {
  success: boolean;
  data: {
    recipes: SavedRecipe[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface RecipeDetailResponse {
  success: boolean;
  data: SavedRecipe;
}

interface SaveRecipeResponse {
  success: boolean;
  data: {
    recipeId: string;
  };
}

interface RecipeFilters {
  search?: string;
  page?: number;
  limit?: number;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) return null;

  try {
    const parsed = JSON.parse(authStorage);
    return parsed.state?.user?.token || null;
  } catch {
    return null;
  }
}

export function useRecipes(filters?: RecipeFilters) {
  const { user } = useAuth();

  return useQuery<RecipesResponse>({
    queryKey: ['recipes', filters],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('인증이 필요합니다');
      }

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/recipes?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('레시피 목록을 불러오는데 실패했습니다');
      }

      return response.json();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecipe(recipeId: string) {
  const { user } = useAuth();

  return useQuery<RecipeDetailResponse>({
    queryKey: ['recipe', recipeId],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('인증이 필요합니다');
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('레시피를 불러오는데 실패했습니다');
      }

      return response.json();
    },
    enabled: !!user && !!recipeId,
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();

  return useMutation<SaveRecipeResponse, Error, { recipe: GeneratedRecipe; userNote?: string }>({
    mutationFn: async (data) => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('인증이 필요합니다');
      }

      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '레시피 저장에 실패했습니다');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (recipeId: string) => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('인증이 필요합니다');
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '레시피 삭제에 실패했습니다');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
