'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface GenerationLoadingProps {
  currentStep?: number;
}

const GENERATION_STEPS = [
  { id: 1, label: '재료 분석 중...', duration: 2000 },
  { id: 2, label: '레시피 생성 중...', duration: 3000 },
  { id: 3, label: '이미지 생성 중...', duration: 3000 },
  { id: 4, label: '최종 확인 중...', duration: 1000 },
];

const TIPS = [
  '💡 생성된 레시피는 저장하거나 공유할 수 있어요',
  '🍎 신선한 재료를 사용하면 더 맛있어요',
  '👶 아기의 월령에 맞는 재료를 선택하는 것이 중요해요',
  '⏰ 조리 시간은 참고용이며 실제와 다를 수 있어요',
  '📸 완성된 음식 사진을 찍어 기록해보세요',
];

export function GenerationLoading({ currentStep = 0 }: GenerationLoadingProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  // 자동으로 step 진행 (Mock용)
  useEffect(() => {
    if (currentStep > 0) {
      setActiveStep(currentStep);
      return;
    }

    const stepTimers: NodeJS.Timeout[] = [];
    let cumulativeTime = 0;

    GENERATION_STEPS.forEach((step, index) => {
      const timer = setTimeout(() => {
        setActiveStep(index + 1);
      }, cumulativeTime);
      stepTimers.push(timer);
      cumulativeTime += step.duration;
    });

    return () => {
      stepTimers.forEach(timer => clearTimeout(timer));
    };
  }, [currentStep]);

  // 팁 로테이션
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 4000);

    return () => clearInterval(tipTimer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(15,70%,95%)] via-[hsl(30,40%,98%)] to-[hsl(280,30%,95%)] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-6">
          {/* 로딩 애니메이션 */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          </div>

          {/* 제목 */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">레시피 생성 중</h2>
            <p className="text-muted-foreground">
              맛있는 아기 간식 레시피를 만들고 있어요
            </p>
          </div>

          {/* 진행 단계 */}
          <div className="space-y-3">
            {GENERATION_STEPS.map((step) => {
              const isCompleted = activeStep > step.id;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  className="flex items-center gap-3 transition-all"
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isCompleted || isActive
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 프로그레스 바 */}
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{
                  width: `${(activeStep / GENERATION_STEPS.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {Math.round((activeStep / GENERATION_STEPS.length) * 100)}% 완료
            </p>
          </div>

          {/* 팁 */}
          <Card className="bg-[hsl(15,50%,95%)] border-[hsl(15,40%,88%)]">
            <CardContent className="pt-4">
              <p className="text-sm text-center transition-opacity duration-500">
                {TIPS[currentTip]}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
