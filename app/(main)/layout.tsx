/**
 * Protected Layout
 *
 * Wraps all authenticated routes
 */

'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
