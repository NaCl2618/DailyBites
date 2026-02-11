'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';
import { searchIngredients } from '@/lib/constants/ingredients';
import { cn } from '@/lib/utils';

interface IngredientInputProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  maxIngredients?: number;
}

export function IngredientInput({
  selectedIngredients,
  onIngredientsChange,
  maxIngredients = 10,
}: IngredientInputProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 검색 결과
  const suggestions = useMemo(() => {
    if (!query) return [];
    const results = searchIngredients(query);
    // 이미 선택된 재료 제외
    return results
      .filter((ing) => !selectedIngredients.includes(ing.name))
      .slice(0, 5);
  }, [query, selectedIngredients]);

  // 재료 추가
  const addIngredient = (ingredientName: string) => {
    if (
      selectedIngredients.length < maxIngredients &&
      !selectedIngredients.includes(ingredientName)
    ) {
      onIngredientsChange([...selectedIngredients, ingredientName]);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  // 재료 제거
  const removeIngredient = (ingredientName: string) => {
    onIngredientsChange(
      selectedIngredients.filter((name) => name !== ingredientName)
    );
  };

  // Enter 키로 첫 번째 추천 재료 추가
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      addIngredient(suggestions[0].name);
    }
  };

  return (
    <div className="space-y-4">
      {/* 재료 입력 필드 */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="재료를 검색하세요 (예: 바나나, 고구마)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // 클릭 이벤트가 처리되도록 약간 지연
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={handleKeyDown}
            className="pl-10"
            disabled={selectedIngredients.length >= maxIngredients}
          />
        </div>

        {/* 자동완성 제안 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
            <ul className="py-2">
              {suggestions.map((ingredient) => (
                <li key={ingredient.id}>
                  <button
                    type="button"
                    onClick={() => addIngredient(ingredient.name)}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{ingredient.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {ingredient.category}
                        </Badge>
                        {ingredient.allergyRisk && (
                          <Badge
                            variant="destructive"
                            className="text-xs"
                          >
                            알레르기주의
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 선택된 재료 태그 */}
      {selectedIngredients.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            선택된 재료 ({selectedIngredients.length}/{maxIngredients})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((name) => (
              <Badge
                key={name}
                variant="secondary"
                className="px-3 py-1.5 text-sm"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeIngredient(name)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      {selectedIngredients.length === 0 && (
        <p className="text-sm text-muted-foreground">
          최소 1개, 최대 {maxIngredients}개의 재료를 선택해주세요
        </p>
      )}

      {selectedIngredients.length >= maxIngredients && (
        <p className="text-sm text-amber-600">
          최대 {maxIngredients}개까지 선택 가능합니다
        </p>
      )}
    </div>
  );
}
