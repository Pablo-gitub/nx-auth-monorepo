import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@assignment-ftechnology/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <div>{children}</div>;
}
