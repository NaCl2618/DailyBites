import { NextRequest, NextResponse } from 'next/server';
import { bkend } from '@/lib/bkend';
import { GeneratedRecipe, SavedRecipe } from '@/types';

export const runtime = 'nodejs';

interface SaveRequest {
  recipe: GeneratedRecipe;
  userNote?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // 사용자 정보 조회
    const currentUser = await bkend.auth.getCurrentUser(token);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 인증 정보입니다' },
        { status: 401 }
      );
    }

    const body: SaveRequest = await request.json();
    const { recipe, userNote } = body;

    // 입력 검증
    if (!recipe || !recipe.title) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 레시피 데이터입니다' },
        { status: 400 }
      );
    }

    // 레시피 저장
    const savedRecipe: Omit<SavedRecipe, '_id' | 'updatedAt'> = {
      ...recipe,
      userId: currentUser._id,
      userNote,
      isFavorite: false,
      createdAt: new Date(),
    };

    const result = await bkend.collection('recipes').create(savedRecipe);

    console.log('[Recipe Save] Success:', result._id);

    return NextResponse.json({
      success: true,
      data: {
        recipeId: result._id,
      },
    });
  } catch (error) {
    console.error('[Recipe Save] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '레시피 저장에 실패했습니다',
      },
      { status: 500 }
    );
  }
}
