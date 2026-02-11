'use client';

import { GeneratedRecipe } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Save,
  Share2,
  RefreshCw,
  PlusCircle,
  Clock,
  ChefHat,
  Baby,
  AlertTriangle,
  LayoutDashboard,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RecipeResultProps {
  recipe: GeneratedRecipe;
  onSave?: () => void;
  onRegenerate?: () => void;
  onNewRecipe?: () => void;
  onShare?: () => void;
}

export function RecipeResult({
  recipe,
  onSave,
  onRegenerate,
  onNewRecipe,
  onShare,
}: RecipeResultProps) {
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleShare = () => {
    // 레시피 내용을 텍스트로 변환
    const recipeText = `
${recipe.title}

[재료]
${recipe.ingredients.map((i) => `- ${i.name} ${i.amount}`).join('\n')}

[조리 방법]
${recipe.steps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

조리 시간: ${recipe.cookingTime}분
난이도: ${difficultyLabels[recipe.difficulty]}
권장 월령: ${recipe.ageRange}
${recipe.allergyWarnings.length > 0 ? `\n알레르기 주의: ${recipe.allergyWarnings.join(', ')}` : ''}

- DailyBites에서 생성된 레시피
`.trim();

    if (navigator.share) {
      navigator
        .share({
          title: recipe.title,
          text: recipeText,
        })
        .catch((err) => console.log('Share failed:', err));
    } else {
      // Fallback: 레시피 내용 복사
      navigator.clipboard.writeText(recipeText);
      alert('레시피가 클립보드에 복사되었습니다!');
    }
    onShare?.();
  };

  const difficultyLabels = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };

  const difficultyColors = {
    easy: 'bg-[hsl(170,30%,90%)] text-[hsl(170,35%,30%)]',
    medium: 'bg-[hsl(40,50%,90%)] text-[hsl(40,40%,30%)]',
    hard: 'bg-[hsl(0,40%,90%)] text-[hsl(0,40%,35%)]',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(15,70%,95%)] via-[hsl(30,40%,98%)] to-[hsl(280,30%,95%)]">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">생성 완료!</h1>
            <div className="flex gap-2">
              {user && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-1 h-4 w-4" />
                    대시보드
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onNewRecipe}>
                새 레시피
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* 이미지 */}
          <Card className="overflow-hidden">
            <div className="relative w-full aspect-video bg-muted">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                </div>
              )}
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </div>
          </Card>

          {/* 제목 및 기본 정보 */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{recipe.title}</h2>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recipe.cookingTime}분
              </Badge>
              <Badge
                className={difficultyColors[recipe.difficulty]}
              >
                <ChefHat className="h-3 w-3 mr-1" />
                {difficultyLabels[recipe.difficulty]}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Baby className="h-3 w-3" />
                {recipe.ageRange}
              </Badge>
            </div>

            {/* 알레르기 경고 */}
            {recipe.allergyWarnings.length > 0 && (
              <Card className="bg-[hsl(35,60%,95%)] border-[hsl(35,50%,85%)]">
                <CardContent className="pt-4">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900 mb-1">
                        알레르기 주의사항
                      </p>
                      <p className="text-sm text-amber-800">
                        {recipe.allergyWarnings.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 재료 */}
          <Card>
            <CardHeader>
              <CardTitle>재료</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-muted-foreground">
                        {' '}
                        {ingredient.amount}
                      </span>
                      {ingredient.isInputIngredient && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          입력 재료
                        </Badge>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 조리 단계 */}
          <Card>
            <CardHeader>
              <CardTitle>조리 방법</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="flex-1 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* 영양 정보 (있는 경우) */}
          {recipe.nutritionInfo && (
            <Card>
              <CardHeader>
                <CardTitle>영양 정보 (1회 제공량)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {recipe.nutritionInfo.calories}
                    </p>
                    <p className="text-sm text-muted-foreground">칼로리 (kcal)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {recipe.nutritionInfo.protein}g
                    </p>
                    <p className="text-sm text-muted-foreground">단백질</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {recipe.nutritionInfo.carbs}g
                    </p>
                    <p className="text-sm text-muted-foreground">탄수화물</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {recipe.nutritionInfo.fat}g
                    </p>
                    <p className="text-sm text-muted-foreground">지방</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 액션 버튼 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {onSave && (
              <Button
                variant="default"
                onClick={onSave}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
            )}
            <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              공유
            </Button>
            {onRegenerate && (
              <Button
                variant="outline"
                onClick={onRegenerate}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 생성
              </Button>
            )}
            {onNewRecipe && (
              <Button
                variant="outline"
                onClick={onNewRecipe}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                새 레시피
              </Button>
            )}
          </div>

          {/* 안내 메시지 */}
          <Card className="bg-[hsl(15,50%,95%)] border-[hsl(15,40%,88%)]">
            <CardContent className="pt-4">
              <p className="text-sm text-center text-muted-foreground">
                💡 이 레시피는 AI가 생성한 것으로 참고용입니다. 아기의 개인적인 건강
                상태와 알레르기를 고려하여 조리해주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
