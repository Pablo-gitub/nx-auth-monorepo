// apps/web/src/app/pages/LoginPage.tsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell, LoginFormBase } from '@assignment-ftechnology/auth-ui';
import { useAuth } from '@assignment-ftechnology/auth';
import type { LoginFormValues } from '@assignment-ftechnology/auth-ui';
import { STRINGS } from '../ui-tokens/strings';

type LocationState = { from?: { pathname: string } };

/**
 * Login page:
 * - Uses presentational UI components from auth-ui
 * - Uses shared auth logic from libs/web/auth
 * - Redirects back to the originally requested protected route (if any)
 */
export function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = React.useState<string | null>(null);

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
      const rawMessage = e instanceof Error ? e.message : '';

      // Map technical errors to user-friendly copy
      const friendly =
        rawMessage.toLowerCase().includes('invalid credentials') ||
        rawMessage.toLowerCase().includes('401')
          ? STRINGS.login.invalidCredentials
          : STRINGS.login.genericLoginError;

      setError(friendly);
    }
  };

  const disabled = status === 'loading';

  return (
    <AuthShell
      title={STRINGS.login.loginTitle}
      subtitle={STRINGS.login.loginSubtitle}
    >
      <LoginFormBase
        onSubmit={onSubmit}
        disabled={disabled}
        error={error}
        submitLabel={STRINGS.login.loginSubmit}
        onChange={() => setError(null)}
        forgotPasswordHref="/forgot-password"
        forgotPasswordLabel={STRINGS.login.forgotPassword}
      />

      <div
        style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <span style={{ opacity: 0.85 }}>{STRINGS.login.registerCtaText}</span>
        <Link to="/register">{STRINGS.login.registerCtaLink}</Link>
      </div>
    </AuthShell>
  );
}
