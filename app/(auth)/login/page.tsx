import { LoginForm } from '@/components/features/auth/LoginForm';
import { ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <ChefHat className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">DailyBites</h1>
      </Link>

      {/* Login Form */}
      <LoginForm />

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
