'use client';

import { useState } from 'react';
import { IngredientInput } from '@/components/features/recipe-generator/IngredientInput';
import { RecipeOptions } from '@/components/features/recipe-generator/RecipeOptions';
import { GenerationLoading } from '@/components/features/recipe-generator/GenerationLoading';
import { RecipeResult } from '@/components/features/recipe-generator/RecipeResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeGenerationOptions, GeneratedRecipe } from '@/types';
import { ChefHat, Sparkles } from 'lucide-react';
type PageState = 'input' | 'loading' | 'result' | 'error';

export default function GeneratePage() {
  const [pageState, setPageState] = useState<PageState>('input');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [options, setOptions] = useState<RecipeGenerationOptions>({});
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) {
      alert('재료를 최소 1개 선택해주세요');
      return;
    }

    // 로딩 상태로 전환
    setPageState('loading');
    setError(null);

    try {
      // 실제 API 호출
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          options,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '레시피 생성에 실패했습니다');
      }

      setGeneratedRecipe(data.data);
      setPageState('result');
    } catch (err) {
      console.error('Recipe generation error:', err);
      setError(err instanceof Error ? err.message : '레시피 생성에 실패했습니다');
      setPageState('error');
    }
  };

  const handleSave = async () => {
    if (!generatedRecipe) return;

    try {
      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe: generatedRecipe,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          window.location.href = '/login';
          return;
        }
        throw new Error(data.error || '레시피 저장에 실패했습니다');
      }

      alert('레시피가 저장되었습니다!');
    } catch (err) {
      console.error('Save error:', err);
      alert(err instanceof Error ? err.message : '레시피 저장에 실패했습니다');
    }
  };

  const handleRegenerate = async () => {
    // 같은 재료로 다시 생성
    await handleGenerate();
  };

  const handleNewRecipe = () => {
    // 처음부터 다시 시작
    setPageState('input');
    setSelectedIngredients([]);
    setOptions({});
    setGeneratedRecipe(null);
  };

  // 로딩 상태
  if (pageState === 'loading') {
    return <GenerationLoading />;
  }

  // 에러 상태
  if (pageState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">생성 실패</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleGenerate}>다시 시도</Button>
                <Button variant="outline" onClick={handleNewRecipe}>
                  처음부터
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 결과 상태
  if (pageState === 'result' && generatedRecipe) {
    return (
      <RecipeResult
        recipe={generatedRecipe}
        onSave={handleSave}
        onRegenerate={handleRegenerate}
        onNewRecipe={handleNewRecipe}
      />
    );
  }

  // 입력 상태 (기본)
  const canGenerate = selectedIngredients.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">DailyBites</h1>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/">홈으로</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              AI 아기 간식 레시피 생성
            </h2>
            <p className="text-muted-foreground">
              냉장고 속 재료로 간편하게 만드는 건강한 아기 간식
            </p>
          </div>

          {/* Ingredient Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>1. 재료 선택</CardTitle>
              <CardDescription>
                집에 있는 재료를 검색하고 선택해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IngredientInput
                selectedIngredients={selectedIngredients}
                onIngredientsChange={setSelectedIngredients}
                maxIngredients={10}
              />
            </CardContent>
          </Card>

          {/* Options Card */}
          <Card>
            <CardHeader>
              <CardTitle>2. 옵션 설정</CardTitle>
              <CardDescription>
                월령과 조리 시간을 선택하면 더 적합한 레시피를 생성합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecipeOptions options={options} onOptionsChange={setOptions} />
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full sm:w-auto min-w-[200px]"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              레시피 생성하기
            </Button>
          </div>

          {/* Info Box */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    💡
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">알아두세요!</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI가 자동으로 안전하고 영양가 있는 레시피를 생성합니다</li>
                    <li>• 선택한 재료를 모두 사용하지 않을 수 있습니다</li>
                    <li>• 알레르기 주의 재료는 경고 표시됩니다</li>
                    <li>• 생성된 레시피는 저장하거나 공유할 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
