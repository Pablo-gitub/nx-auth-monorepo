// apps/web/src/app/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const isAuthenticated = false; // placeholder

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
