'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecipeGenerationOptions } from '@/types';
import { Baby, Clock } from 'lucide-react';

interface RecipeOptionsProps {
  options: RecipeGenerationOptions;
  onOptionsChange: (options: RecipeGenerationOptions) => void;
}

export function RecipeOptions({
  options,
  onOptionsChange,
}: RecipeOptionsProps) {
  const ageRanges: Array<{
    value: '6-12' | '12-24' | '24+';
    label: string;
  }> = [
    { value: '6-12', label: '6-12개월' },
    { value: '12-24', label: '12-24개월' },
    { value: '24+', label: '24개월+' },
  ];

  const cookingTimes: Array<{
    value: 'quick' | 'normal';
    label: string;
    description: string;
  }> = [
    { value: 'quick', label: '빠른 조리', description: '15분 이내' },
    { value: 'normal', label: '보통 조리', description: '30분 이내' },
  ];

  return (
    <div className="space-y-6">
      {/* 월령 선택 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Baby className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium">
            아기 월령 (선택사항)
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {ageRanges.map((range) => (
            <Button
              key={range.value}
              type="button"
              variant={
                options.ageRange === range.value ? 'default' : 'outline'
              }
              size="sm"
              onClick={() =>
                onOptionsChange({
                  ...options,
                  ageRange:
                    options.ageRange === range.value
                      ? undefined
                      : range.value,
                })
              }
            >
              {range.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          월령을 선택하면 해당 월령에 적합한 레시피를 생성합니다
        </p>
      </div>

      {/* 조리 시간 선택 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium">
            조리 시간 (선택사항)
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {cookingTimes.map((time) => (
            <Button
              key={time.value}
              type="button"
              variant={
                options.cookingTime === time.value
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() =>
                onOptionsChange({
                  ...options,
                  cookingTime:
                    options.cookingTime === time.value
                      ? undefined
                      : time.value,
                })
              }
              className="flex-col h-auto py-2"
            >
              <span className="font-medium">{time.label}</span>
              <span className="text-xs opacity-70">
                {time.description}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* 선택된 옵션 요약 */}
      {(options.ageRange || options.cookingTime) && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">선택된 옵션:</p>
          <div className="flex flex-wrap gap-2">
            {options.ageRange && (
              <Badge variant="secondary">
                {
                  ageRanges.find((r) => r.value === options.ageRange)
                    ?.label
                }
              </Badge>
            )}
            {options.cookingTime && (
              <Badge variant="secondary">
                {
                  cookingTimes.find(
                    (t) => t.value === options.cookingTime
                  )?.label
                }
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
