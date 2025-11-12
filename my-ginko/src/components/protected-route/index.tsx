import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ isAllowed, fallback }: ProtectedRouteProps) {
  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <Outlet />;
}
