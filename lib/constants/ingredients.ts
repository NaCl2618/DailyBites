import { Ingredient } from '@/types';

/**
 * 재료 마스터 데이터
 * 아기 간식에 적합한 재료 목록
 */
export const INGREDIENTS: Ingredient[] = [
  // 과일
  {
    id: 'banana',
    name: '바나나',
    category: '과일',
    allergyRisk: false,
    minAge: 6,
    keywords: ['바나나', 'banana'],
  },
  {
    id: 'apple',
    name: '사과',
    category: '과일',
    allergyRisk: false,
    minAge: 6,
    keywords: ['사과', 'apple'],
  },
  {
    id: 'pear',
    name: '배',
    category: '과일',
    allergyRisk: false,
    minAge: 6,
    keywords: ['배', 'pear'],
  },
  {
    id: 'strawberry',
    name: '딸기',
    category: '과일',
    allergyRisk: true,
    minAge: 12,
    keywords: ['딸기', 'strawberry'],
  },
  {
    id: 'blueberry',
    name: '블루베리',
    category: '과일',
    allergyRisk: false,
    minAge: 8,
    keywords: ['블루베리', 'blueberry'],
  },
  {
    id: 'avocado',
    name: '아보카도',
    category: '과일',
    allergyRisk: false,
    minAge: 6,
    keywords: ['아보카도', 'avocado'],
  },
  {
    id: 'mango',
    name: '망고',
    category: '과일',
    allergyRisk: false,
    minAge: 8,
    keywords: ['망고', 'mango'],
  },
  {
    id: 'watermelon',
    name: '수박',
    category: '과일',
    allergyRisk: false,
    minAge: 8,
    keywords: ['수박', 'watermelon'],
  },
  {
    id: 'peach',
    name: '복숭아',
    category: '과일',
    allergyRisk: true,
    minAge: 8,
    keywords: ['복숭아', 'peach'],
  },
  {
    id: 'grape',
    name: '포도',
    category: '과일',
    allergyRisk: false,
    minAge: 12,
    keywords: ['포도', 'grape'],
  },

  // 채소
  {
    id: 'sweet-potato',
    name: '고구마',
    category: '채소',
    allergyRisk: false,
    minAge: 6,
    keywords: ['고구마', 'sweet potato'],
  },
  {
    id: 'potato',
    name: '감자',
    category: '채소',
    allergyRisk: false,
    minAge: 6,
    keywords: ['감자', 'potato'],
  },
  {
    id: 'carrot',
    name: '당근',
    category: '채소',
    allergyRisk: false,
    minAge: 6,
    keywords: ['당근', 'carrot'],
  },
  {
    id: 'pumpkin',
    name: '호박',
    category: '채소',
    allergyRisk: false,
    minAge: 6,
    keywords: ['호박', 'pumpkin'],
  },
  {
    id: 'broccoli',
    name: '브로콜리',
    category: '채소',
    allergyRisk: false,
    minAge: 8,
    keywords: ['브로콜리', 'broccoli'],
  },
  {
    id: 'spinach',
    name: '시금치',
    category: '채소',
    allergyRisk: false,
    minAge: 6,
    keywords: ['시금치', 'spinach'],
  },
  {
    id: 'cabbage',
    name: '양배추',
    category: '채소',
    allergyRisk: false,
    minAge: 8,
    keywords: ['양배추', 'cabbage'],
  },
  {
    id: 'zucchini',
    name: '애호박',
    category: '채소',
    allergyRisk: false,
    minAge: 6,
    keywords: ['애호박', 'zucchini'],
  },
  {
    id: 'cucumber',
    name: '오이',
    category: '채소',
    allergyRisk: false,
    minAge: 8,
    keywords: ['오이', 'cucumber'],
  },
  {
    id: 'tomato',
    name: '토마토',
    category: '채소',
    allergyRisk: true,
    minAge: 12,
    keywords: ['토마토', 'tomato'],
  },

  // 곡류
  {
    id: 'rice',
    name: '쌀',
    category: '곡류',
    allergyRisk: false,
    minAge: 6,
    keywords: ['쌀', 'rice', '밥'],
  },
  {
    id: 'oatmeal',
    name: '오트밀',
    category: '곡류',
    allergyRisk: false,
    minAge: 6,
    keywords: ['오트밀', 'oatmeal', '귀리'],
  },
  {
    id: 'bread',
    name: '식빵',
    category: '곡류',
    allergyRisk: true,
    minAge: 12,
    keywords: ['식빵', 'bread', '빵'],
  },
  {
    id: 'noodle',
    name: '국수',
    category: '곡류',
    allergyRisk: true,
    minAge: 12,
    keywords: ['국수', 'noodle', '면'],
  },
  {
    id: 'corn',
    name: '옥수수',
    category: '곡류',
    allergyRisk: false,
    minAge: 8,
    keywords: ['옥수수', 'corn'],
  },

  // 단백질
  {
    id: 'chicken',
    name: '닭고기',
    category: '단백질',
    allergyRisk: false,
    minAge: 8,
    keywords: ['닭고기', 'chicken', '닭'],
  },
  {
    id: 'beef',
    name: '소고기',
    category: '단백질',
    allergyRisk: false,
    minAge: 6,
    keywords: ['소고기', 'beef', '쇠고기'],
  },
  {
    id: 'pork',
    name: '돼지고기',
    category: '단백질',
    allergyRisk: false,
    minAge: 8,
    keywords: ['돼지고기', 'pork'],
  },
  {
    id: 'egg',
    name: '계란',
    category: '단백질',
    allergyRisk: true,
    minAge: 12,
    keywords: ['계란', 'egg', '달걀'],
  },
  {
    id: 'tofu',
    name: '두부',
    category: '단백질',
    allergyRisk: true,
    minAge: 8,
    keywords: ['두부', 'tofu'],
  },
  {
    id: 'fish',
    name: '생선',
    category: '단백질',
    allergyRisk: true,
    minAge: 8,
    keywords: ['생선', 'fish'],
  },

  // 유제품
  {
    id: 'milk',
    name: '우유',
    category: '유제품',
    allergyRisk: true,
    minAge: 12,
    keywords: ['우유', 'milk'],
  },
  {
    id: 'yogurt',
    name: '요거트',
    category: '유제품',
    allergyRisk: true,
    minAge: 12,
    keywords: ['요거트', 'yogurt', '요구르트'],
  },
  {
    id: 'cheese',
    name: '치즈',
    category: '유제품',
    allergyRisk: true,
    minAge: 12,
    keywords: ['치즈', 'cheese'],
  },

  // 기타
  {
    id: 'sesame',
    name: '참깨',
    category: '기타',
    allergyRisk: true,
    minAge: 12,
    keywords: ['참깨', 'sesame'],
  },
  {
    id: 'olive-oil',
    name: '올리브유',
    category: '기타',
    allergyRisk: false,
    minAge: 6,
    keywords: ['올리브유', 'olive oil', '오일'],
  },
  {
    id: 'butter',
    name: '버터',
    category: '기타',
    allergyRisk: true,
    minAge: 12,
    keywords: ['버터', 'butter'],
  },
];

/**
 * 재료 이름으로 검색
 */
export function searchIngredients(query: string): Ingredient[] {
  if (!query) return INGREDIENTS;

  const lowerQuery = query.toLowerCase();
  return INGREDIENTS.filter((ingredient) =>
    ingredient.keywords.some((keyword) =>
      keyword.toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * 카테고리별 재료 가져오기
 */
export function getIngredientsByCategory(
  category: string
): Ingredient[] {
  return INGREDIENTS.filter((ing) => ing.category === category);
}

/**
 * 월령에 적합한 재료 필터링
 */
export function filterIngredientsByAge(
  ageMonths: number
): Ingredient[] {
  return INGREDIENTS.filter((ing) => ing.minAge <= ageMonths);
}
