import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedRecipe, RecipeGenerationOptions } from '@/types';

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 레시피 생성 프롬프트 생성
 */
function createRecipePrompt(
  ingredients: string[],
  options: RecipeGenerationOptions = {}
): string {
  const { ageRange, cookingTime } = options;

  let prompt = `당신은 영유아 영양 전문가입니다. 다음 재료를 사용하여 아기 간식 레시피를 생성해주세요.

재료: ${ingredients.join(', ')}`;

  if (ageRange) {
    const ageLabels = {
      '6-12': '6-12개월',
      '12-24': '12-24개월',
      '24+': '24개월 이상',
    };
    prompt += `\n적합 월령: ${ageLabels[ageRange]}`;
  }

  if (cookingTime === 'quick') {
    prompt += `\n조리 시간: 15분 이내 (빠른 레시피)`;
  } else {
    prompt += `\n조리 시간: 30분 이내`;
  }

  prompt += `

다음 JSON 형식으로 레시피를 생성해주세요. 반드시 유효한 JSON만 반환하세요:

{
  "title": "레시피 제목 (예: 바나나 아보카도 퓨레)",
  "ingredients": [
    {
      "name": "재료명",
      "amount": "양 (예: 1개, 100g)",
      "isInputIngredient": true 또는 false
    }
  ],
  "steps": [
    "1단계 설명",
    "2단계 설명",
    "3단계 설명"
  ],
  "cookingTime": 조리시간(분 단위, 숫자),
  "difficulty": "easy" 또는 "medium" 또는 "hard",
  "ageRange": "적합 월령 (예: 6-12개월, 12-24개월, 24개월+)",
  "allergyWarnings": ["알레르기 유발 가능 재료"],
  "nutritionInfo": {
    "calories": 숫자,
    "protein": 숫자,
    "carbs": 숫자,
    "fat": 숫자
  }
}

주의사항:
- 아기에게 안전한 재료만 사용
- 소금, 설탕 최소화
- 알레르기 유발 가능 재료는 반드시 allergyWarnings에 명시
- 조리 단계는 명확하고 구체적으로 (3-7단계)
- 입력된 재료는 가능한 모두 활용 (전부 사용할 필요는 없음)
- isInputIngredient는 입력된 재료인지 여부를 표시
- 반드시 유효한 JSON 형식으로만 응답`;

  return prompt;
}

/**
 * 이미지 생성 프롬프트 생성 (영어 - AI 이미지 생성에 최적화)
 */
export function createImagePrompt(
  recipeTitle: string,
  mainIngredients: string[]
): string {
  return `A beautiful and appetizing baby food snack made with ${mainIngredients.join(', ')}, served in a cute baby bowl, soft lighting, warm tones, professional food photography style, high quality, top-down view, no text, healthy and colorful presentation, natural ingredients, appealing to parents`;
}

/**
 * 재료 기반으로 적합한 아기 간식 이미지 선택 (Unsplash)
 */
export async function generateImageWithGemini(
  recipeTitle: string,
  mainIngredients: string[]
): Promise<string> {
  try {
    // 재료 기반 이미지 매핑
    const ingredientImageMap: Record<string, string> = {
      // 과일류
      바나나: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=1024&h=1024&fit=crop&q=80',
      아보카도: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1024&h=1024&fit=crop&q=80',
      사과: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1024&h=1024&fit=crop&q=80',
      블루베리: 'https://images.unsplash.com/photo-1587334207976-c9a0c6f1f88e?w=1024&h=1024&fit=crop&q=80',
      딸기: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=1024&h=1024&fit=crop&q=80',

      // 채소류
      당근: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=1024&h=1024&fit=crop&q=80',
      고구마: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=1024&h=1024&fit=crop&q=80',
      브로콜리: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=1024&h=1024&fit=crop&q=80',
      시금치: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=1024&h=1024&fit=crop&q=80',

      // 곡물류
      쌀: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=1024&h=1024&fit=crop&q=80',
      오트밀: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=1024&h=1024&fit=crop&q=80',

      // 유제품
      요거트: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1024&h=1024&fit=crop&q=80',
      치즈: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1024&h=1024&fit=crop&q=80',
    };

    // 첫 번째 재료로 이미지 선택
    for (const ingredient of mainIngredients) {
      if (ingredientImageMap[ingredient]) {
        console.log(`[Image] Selected Unsplash image for: ${ingredient}`);
        return ingredientImageMap[ingredient];
      }
    }

    // 매칭되는 재료가 없으면 랜덤 아기 음식 이미지
    console.log('[Image] Using random baby food image');
    return getFallbackImage();
  } catch (error) {
    console.error('[Image] Error selecting image:', error);
    return getFallbackImage();
  }
}

/**
 * 재료 기반 아기 간식 이미지 (Unsplash 큐레이션)
 */
function getFallbackImage(): string {
  const babyFoodImages = [
    // 과일 기반
    'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=1024&h=1024&fit=crop&q=80', // 바나나
    'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1024&h=1024&fit=crop&q=80', // 아보카도
    'https://images.unsplash.com/photo-1587334207976-c9a0c6f1f88e?w=1024&h=1024&fit=crop&q=80', // 베리류

    // 채소 기반
    'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=1024&h=1024&fit=crop&q=80', // 당근
    'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=1024&h=1024&fit=crop&q=80', // 고구마

    // 곡물 기반
    'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=1024&h=1024&fit=crop&q=80', // 쌀
    'https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=1024&h=1024&fit=crop&q=80', // 시리얼

    // 일반 아기 음식
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1024&h=1024&fit=crop&q=80', // 퓨레
    'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=1024&h=1024&fit=crop&q=80', // 스무디
  ];
  return babyFoodImages[Math.floor(Math.random() * babyFoodImages.length)];
}

/**
 * Gemini로 레시피 생성
 */
export async function generateRecipeWithGemini(
  ingredients: string[],
  options: RecipeGenerationOptions = {}
): Promise<Omit<GeneratedRecipe, 'imageUrl' | 'imagePrompt'>> {
  try {
    // Gemini 2.5 Flash 모델 사용
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = createRecipePrompt(ingredients, options);

    // 레시피 생성
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 파싱
    // Gemini가 ```json ... ``` 형식으로 반환할 수 있으므로 처리
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const recipeData = JSON.parse(jsonText);

    // 생성된 레시피 반환 (이미지 제외)
    return {
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      cookingTime: recipeData.cookingTime,
      difficulty: recipeData.difficulty,
      ageRange: recipeData.ageRange,
      allergyWarnings: recipeData.allergyWarnings || [],
      nutritionInfo: recipeData.nutritionInfo,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('레시피 생성에 실패했습니다. 다시 시도해주세요.');
  }
}
