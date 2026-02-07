/**
 * My Recipes Page
 *
 * Shows all saved recipes with search and pagination
 */

'use client';

import { useState } from 'react';
import { useRecipes, useDeleteRecipe } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RecipeCard } from '@/components/features/recipe-generator/RecipeCard';
import Link from 'next/link';
import { ChefHat, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function MyRecipesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRecipes({ search, page, limit: 12 });
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = (recipeId: string) => {
    deleteRecipe.mutate(recipeId, {
      onSuccess: () => {
        toast.success('레시피가 삭제되었습니다');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const recipes = data?.data.recipes || [];
  const pagination = data?.data.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-bold">DailyBites</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">대시보드</Button>
              </Link>
              <Link href="/my-recipes">
                <Button variant="ghost">내 레시피</Button>
              </Link>
              <Link href="/generate">
                <Button variant="default">레시피 생성</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">내 레시피</h1>
          <p className="text-gray-600">
            {pagination?.total || 0}개의 저장된 레시피
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="레시피 검색..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">레시피를 불러오는 중...</p>
          </div>
        ) : recipes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">
                {search ? '검색 결과가 없습니다' : '아직 저장된 레시피가 없습니다'}
              </h3>
              <p className="text-gray-600 mb-4">
                {search
                  ? '다른 키워드로 검색해보세요'
                  : '첫 번째 레시피를 만들어보세요!'}
              </p>
              <Link href="/generate">
                <Button>레시피 생성하기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </Button>
                <span className="text-sm text-gray-600">
                  {page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
