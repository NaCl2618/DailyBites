import { NextRequest, NextResponse } from 'next/server';
import { bkend } from '@/lib/bkend';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    // Query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';

    // 레시피 조회
    const query: any = { userId: currentUser._id };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    // 총 개수 조회
    const total = await bkend.collection('recipes').count(query);

    // 레시피 목록 조회
    const recipes = await bkend
      .collection('recipes')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        recipes,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('[Recipes List] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '레시피 목록 조회에 실패했습니다',
      },
      { status: 500 }
    );
  }
}
