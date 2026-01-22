import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthShell, LoginFormBase } from '@assignment-ftechnology/auth-ui';
import { useAuth } from '@assignment-ftechnology/auth';
import type { LoginFormValues } from '@assignment-ftechnology/auth-ui';

type LocationState = { from?: { pathname: string } };

/**
 * Login page:
 * - Uses Auth UI components (presentational)
 * - Uses Auth logic from the shared auth library
 * - Redirects to the protected page after successful login
 */
export function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = React.useState<string | null>(null);

  // If the user got redirected here from a protected route, we send them back after login
  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? '/dashboard';

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);

    try {
      await login({
        email: values.email,
        password: values.password,
        // Ensure rememberMe is ALWAYS a boolean for the API contract
        rememberMe: Boolean(values.rememberMe),
      });

      navigate(redirectTo, { replace: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Login failed';
      setError(message);
    }
  };

  const disabled = status === 'loading';

  return (
    <AuthShell title="Login" subtitle="Sign in to access your dashboard">
      <LoginFormBase onSubmit={onSubmit} disabled={disabled} error={error} />
    </AuthShell>
  );
}
