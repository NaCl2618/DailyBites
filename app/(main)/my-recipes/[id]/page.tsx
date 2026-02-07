/**
 * Recipe Detail Page
 *
 * Shows detailed view of a saved recipe
 */

'use client';

import { use } from 'react';
import { useRecipe, useDeleteRecipe } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Clock, Baby, AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useRecipe(id);
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = () => {
    if (!window.confirm('이 레시피를 삭제하시겠습니까?')) {
      return;
    }

    deleteRecipe.mutate(id, {
      onSuccess: () => {
        toast.success('레시피가 삭제되었습니다');
        router.push('/my-recipes');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/my-recipes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              내 레시피로 돌아가기
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">레시피를 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/my-recipes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              내 레시피로 돌아가기
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold mb-2">레시피를 불러올 수 없습니다</h3>
              <p className="text-gray-600 mb-4">{error?.message || '레시피를 찾을 수 없습니다'}</p>
              <Link href="/my-recipes">
                <Button>내 레시피로 돌아가기</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const recipe = data.data;

  const difficultyLabels = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/my-recipes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              내 레시피로 돌아가기
            </Link>

            <Button variant="destructive" onClick={handleDelete} disabled={deleteRecipe.isPending}>
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          {/* Recipe Image */}
          <div className="relative w-full h-96">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover rounded-t-lg"
              priority
            />
          </div>

          <CardContent className="p-6">
            {/* Title and Meta */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recipe.cookingTime}분
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ChefHat className="w-4 h-4" />
                  {difficultyLabels[recipe.difficulty]}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Baby className="w-4 h-4" />
                  {recipe.ageRange}
                </Badge>
              </div>
            </div>

            {/* User Note */}
            {recipe.userNote && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">내 메모</p>
                <p className="text-gray-700">{recipe.userNote}</p>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">재료</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-2 ${
                      ingredient.isInputIngredient ? 'text-primary-600 font-medium' : ''
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    <span>{ingredient.name}</span>
                    <span className="text-gray-600">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">조리 단계</h2>
              <ol className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <p className="text-gray-700 pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Allergy Warnings */}
            {recipe.allergyWarnings && recipe.allergyWarnings.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="flex items-center gap-2 text-yellow-900 font-semibold mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  알레르기 주의사항
                </h3>
                <ul className="space-y-1">
                  {recipe.allergyWarnings.map((warning, idx) => (
                    <li key={idx} className="text-yellow-800">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutrition Info */}
            {recipe.nutritionInfo && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">영양 정보</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">칼로리</p>
                    <p className="text-lg font-semibold">{recipe.nutritionInfo.calories} kcal</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">단백질</p>
                    <p className="text-lg font-semibold">{recipe.nutritionInfo.protein}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">탄수화물</p>
                    <p className="text-lg font-semibold">{recipe.nutritionInfo.carbs}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">지방</p>
                    <p className="text-lg font-semibold">{recipe.nutritionInfo.fat}g</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
