import { NextRequest, NextResponse } from 'next/server';
import { bkend } from '@/lib/bkend';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
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

    const params = await context.params;
    const { id } = params;

    // 레시피 조회
    const recipe = await bkend.collection('recipes').findOne({
      _id: id,
      userId: currentUser._id
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: '레시피를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error('[Recipe Detail] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '레시피 조회에 실패했습니다',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
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

    const params = await context.params;
    const { id } = params;

    // 레시피 존재 및 권한 확인
    const recipe = await bkend.collection('recipes').findOne({
      _id: id,
      userId: currentUser._id
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: '레시피를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 레시피 삭제
    await bkend.collection('recipes').deleteOne({ _id: id });

    console.log('[Recipe Delete] Success:', id);

    return NextResponse.json({
      success: true,
      message: '레시피가 삭제되었습니다',
    });
  } catch (error) {
    console.error('[Recipe Delete] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '레시피 삭제에 실패했습니다',
      },
      { status: 500 }
    );
  }
}
