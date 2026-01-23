// apps/web/src/app/routes/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

/**
 * Application router.
 *
 * Defines all public and protected routes of the application.
 */
export function AppRouter() {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
}
