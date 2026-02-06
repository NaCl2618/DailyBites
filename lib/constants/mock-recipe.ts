import { GeneratedRecipe } from '@/types';

/**
 * Mock 레시피 데이터
 * AI API 연동 전 UI 테스트용
 */
export const MOCK_RECIPES: GeneratedRecipe[] = [
  {
    id: 'mock-1',
    title: '바나나 고구마 퓨레',
    ingredients: [
      { name: '바나나', amount: '1개', isInputIngredient: true },
      { name: '고구마', amount: '100g', isInputIngredient: true },
      { name: '물', amount: '50ml', isInputIngredient: false },
    ],
    steps: [
      '고구마는 깨끗이 씻어 껍질을 벗긴 후 작게 깍둑썰기 해주세요.',
      '냄비에 고구마와 물을 넣고 부드러워질 때까지 15분간 삶아주세요.',
      '바나나는 껍질을 벗기고 적당한 크기로 썰어주세요.',
      '삶은 고구마와 바나나를 함께 으깨거나 믹서기에 갈아주세요.',
      '부드러운 퓨레 상태가 되면 완성입니다. 따뜻하게 드세요!',
    ],
    cookingTime: 20,
    difficulty: 'easy',
    ageRange: '6-12개월',
    allergyWarnings: [],
    imageUrl: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=800&h=800&fit=crop',
    imagePrompt: 'A beautiful, appetizing photo of banana sweet potato puree baby food',
    nutritionInfo: {
      calories: 120,
      protein: 2,
      carbs: 28,
      fat: 0.5,
    },
    createdAt: new Date(),
  },
  {
    id: 'mock-2',
    title: '아보카도 사과 스무디',
    ingredients: [
      { name: '아보카도', amount: '1/2개', isInputIngredient: true },
      { name: '사과', amount: '1/2개', isInputIngredient: true },
      { name: '요거트', amount: '100ml', isInputIngredient: false },
    ],
    steps: [
      '아보카도는 반으로 갈라 씨를 제거하고 과육만 떠내주세요.',
      '사과는 껍질을 벗기고 씨를 제거한 후 작게 썰어주세요.',
      '아보카도, 사과, 요거트를 믹서기에 넣어주세요.',
      '부드럽게 갈릴 때까지 1-2분간 믹서기를 돌려주세요.',
      '컵에 담아 바로 드시거나 냉장 보관 후 드세요.',
    ],
    cookingTime: 10,
    difficulty: 'easy',
    ageRange: '12-24개월',
    allergyWarnings: ['유제품 (요거트)'],
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&h=800&fit=crop',
    imagePrompt: 'A beautiful, appetizing photo of avocado apple smoothie baby food',
    nutritionInfo: {
      calories: 180,
      protein: 4,
      carbs: 22,
      fat: 9,
    },
    createdAt: new Date(),
  },
  {
    id: 'mock-3',
    title: '닭고기 채소 죽',
    ingredients: [
      { name: '닭고기', amount: '50g', isInputIngredient: true },
      { name: '당근', amount: '30g', isInputIngredient: true },
      { name: '브로콜리', amount: '30g', isInputIngredient: true },
      { name: '쌀', amount: '1/4컵', isInputIngredient: false },
      { name: '물', amount: '500ml', isInputIngredient: false },
    ],
    steps: [
      '쌀은 30분 정도 불린 후 물기를 빼주세요.',
      '닭고기는 삶아서 잘게 찢어주세요.',
      '당근과 브로콜리는 작게 다져주세요.',
      '냄비에 쌀과 물을 넣고 약불에서 20분간 끓여주세요.',
      '쌀이 부드러워지면 닭고기와 채소를 넣고 10분 더 끓여주세요.',
      '적당한 농도가 되면 불을 끄고 한 김 식혀서 드세요.',
    ],
    cookingTime: 40,
    difficulty: 'medium',
    ageRange: '12-24개월',
    allergyWarnings: [],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=800&fit=crop',
    imagePrompt: 'A beautiful, appetizing photo of chicken vegetable porridge baby food',
    nutritionInfo: {
      calories: 200,
      protein: 12,
      carbs: 30,
      fat: 3,
    },
    createdAt: new Date(),
  },
];

/**
 * 랜덤 Mock 레시피 반환
 */
export function getRandomMockRecipe(): GeneratedRecipe {
  const randomIndex = Math.floor(Math.random() * MOCK_RECIPES.length);
  return MOCK_RECIPES[randomIndex];
}

/**
 * 재료 기반으로 Mock 레시피 선택
 * (실제로는 간단한 매칭만 수행)
 */
export function getMockRecipeByIngredients(ingredients: string[]): GeneratedRecipe {
  // 바나나가 포함되면 첫 번째 레시피
  if (ingredients.some(ing => ing.includes('바나나'))) {
    return MOCK_RECIPES[0];
  }
  // 아보카도가 포함되면 두 번째 레시피
  if (ingredients.some(ing => ing.includes('아보카도'))) {
    return MOCK_RECIPES[1];
  }
  // 닭고기가 포함되면 세 번째 레시피
  if (ingredients.some(ing => ing.includes('닭고기'))) {
    return MOCK_RECIPES[2];
  }
  // 기본값: 랜덤
  return getRandomMockRecipe();
}
