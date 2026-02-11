/**
 * Protected Route Component
 *
 * Wraps pages that require authentication.
 * Uses useEffect to wait for client-side mount (zustand hydration).
 * Redirects to /login if user is not authenticated.
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 클라이언트 마운트 후 zustand persist가 localStorage에서 복원 완료
    setMounted(true);
  }, []);

  useEffect(() => {
    // 마운트 완료 후에만 인증 체크
    if (mounted && !user) {
      router.replace('/login');
    }
  }, [mounted, user, router]);

  // 마운트 전 (SSR/hydration 중) → 로딩 표시
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 마운트 후 user 없으면 리다이렉트 대기
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
