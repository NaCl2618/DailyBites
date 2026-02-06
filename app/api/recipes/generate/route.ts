import { NextRequest, NextResponse } from 'next/server';
import {
  generateRecipeWithGemini,
  generateImageWithGemini,
} from '@/lib/api/gemini';
import { GeneratedRecipe, RecipeGenerationOptions } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 최대 60초

interface GenerateRequest {
  ingredients: string[];
  options?: RecipeGenerationOptions;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { ingredients, options = {} } = body;

    // 입력 검증
    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: '재료를 최소 1개 입력해주세요' },
        { status: 400 }
      );
    }

    if (ingredients.length > 10) {
      return NextResponse.json(
        { error: '재료는 최대 10개까지 입력 가능합니다' },
        { status: 400 }
      );
    }

    console.log('[Recipe Generate] Starting with ingredients:', ingredients);

    // 1. Gemini로 레시피 생성
    console.log('[Recipe Generate] Step 1: Generating recipe with Gemini...');
    const recipeData = await generateRecipeWithGemini(ingredients, options);

    // 2. Gemini 2.5 Flash로 이미지 생성
    console.log('[Recipe Generate] Step 2: Generating image with Gemini 2.5 Flash...');
    const mainIngredients = ingredients.slice(0, 3); // 주요 재료 3개
    const imageUrl = await generateImageWithGemini(
      recipeData.title,
      mainIngredients
    );

    // 이미지 프롬프트 (참고용)
    const imagePrompt = `${recipeData.title} - ${mainIngredients.join(', ')}`;

    // 3. 최종 레시피 객체 생성
    const recipe: GeneratedRecipe = {
      ...recipeData,
      imageUrl,
      imagePrompt,
    };

    console.log('[Recipe Generate] Success! Recipe:', recipe.title);

    return NextResponse.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error('[Recipe Generate] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '레시피 생성에 실패했습니다',
      },
      { status: 500 }
    );
  }
}
