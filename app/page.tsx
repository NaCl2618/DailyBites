import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Sparkles, Heart, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <ChefHat className="h-10 w-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            AI가 만들어주는
            <br />
            <span className="text-primary">아기 간식 레시피</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            냉장고 속 재료를 입력하면 AI가 영양가 있고 안전한
            <br className="hidden sm:block" />
            아기 간식 레시피를 자동으로 생성해드립니다
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/generate">
                <Sparkles className="mr-2 h-5 w-5" />
                레시피 생성하기
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI 자동 생성</h3>
              <p className="text-muted-foreground text-sm">
                재료만 입력하면 AI가 30초 안에 레시피와 이미지를 자동으로 생성합니다
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-lg mb-2">안전한 레시피</h3>
              <p className="text-muted-foreground text-sm">
                영유아 영양 가이드라인을 준수하고 알레르기 주의 재료를 표시합니다
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">시간 절약</h3>
              <p className="text-muted-foreground text-sm">
                레시피 검색 시간을 절약하고 즉시 조리를 시작할 수 있습니다
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-2xl max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          간단한 3단계
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="font-bold">재료 입력</h3>
            <p className="text-sm text-muted-foreground">
              냉장고에 있는 재료를 검색하고 선택하세요
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="font-bold">AI 생성</h3>
            <p className="text-sm text-muted-foreground">
              AI가 레시피와 완성 이미지를 자동으로 생성합니다
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="font-bold">저장 & 공유</h3>
            <p className="text-sm text-muted-foreground">
              마음에 드는 레시피를 저장하고 친구들과 공유하세요
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">
            지금 바로 시작해보세요!
          </h2>
          <p className="text-muted-foreground">
            무료로 아기 간식 레시피를 생성하고 저장할 수 있습니다
          </p>
          <Button size="lg" asChild>
            <Link href="/generate">
              <Sparkles className="mr-2 h-5 w-5" />
              레시피 생성하기
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 DailyBites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
