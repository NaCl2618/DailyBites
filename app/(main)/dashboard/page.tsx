/**
 * Dashboard Page
 *
 * User dashboard showing stats and recent recipes
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeCard } from '@/components/features/recipe-generator/RecipeCard';
import { useDeleteRecipe } from '@/hooks/useRecipes';
import Link from 'next/link';
import { ChefHat, BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useRecipes({ limit: 6 });
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

  const totalRecipes = data?.data.pagination.total || 0;

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
        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            안녕하세요, {user?.name || user?.email}님!
          </h1>
          <p className="text-gray-600">오늘은 어떤 간식을 만들어볼까요?</p>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" />
                저장된 레시피
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-500">{totalRecipes}</p>
              <p className="text-sm text-gray-600 mt-1">개의 레시피</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-500" />
                빠른 생성
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/generate">
                <Button className="w-full">새 레시피 만들기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                최근 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {data?.data.recipes[0]?.createdAt
                  ? `최근 저장: ${new Date(data.data.recipes[0].createdAt).toLocaleDateString()}`
                  : '아직 저장된 레시피가 없습니다'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Recipes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">최근 레시피</h2>
            <Link href="/my-recipes">
              <Button variant="outline">모두 보기</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">레시피를 불러오는 중...</p>
            </div>
          ) : totalRecipes === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">아직 저장된 레시피가 없습니다</h3>
                <p className="text-gray-600 mb-4">첫 번째 레시피를 만들어보세요!</p>
                <Link href="/generate">
                  <Button>레시피 생성하기</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
