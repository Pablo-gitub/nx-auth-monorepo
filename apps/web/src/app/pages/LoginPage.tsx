import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell, LoginFormBase } from '@assignment-ftechnology/auth-ui';
import { useAuth } from '@assignment-ftechnology/auth';
import type { LoginFormValues } from '@assignment-ftechnology/auth-ui';
import { loginSchema } from '@assignment-ftechnology/contracts';
import { STRINGS } from '../ui-tokens/strings';
import { zodToFieldErrors } from '../shared/zod-field-errors';
import { toast } from 'react-toastify';

type LocationState = { from?: { pathname: string } };

type LoginField = 'email' | 'password';

export function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<LoginField, string>>
  >({});

  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? '/dashboard';

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors();

    // Client-side validation (keeps UI field errors stable + testable)
    const parsed = loginSchema.safeParse({
      email: values.email,
      password: values.password,
      rememberMe: Boolean(values.rememberMe),
    });

    if (!parsed.success) {
      setFieldErrors(zodToFieldErrors<LoginField>(parsed.error));
      return;
    }

    try {
      await login({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: Boolean(parsed.data.rememberMe),
      });
      toast.success('Login successful');
      navigate(redirectTo, { replace: true });
    } catch (e) {
      const rawMessage = e instanceof Error ? e.message : '';

      // Technical -> user-friendly mapping
      const friendly =
        rawMessage.toLowerCase().includes('invalid credentials') ||
        rawMessage.toLowerCase().includes('401')
          ? STRINGS.login.invalidCredentials
          : STRINGS.login.genericLoginError;

      setError(friendly);
      toast.error(friendly);
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
        fieldErrors={fieldErrors}
        submitLabel={STRINGS.login.loginSubmit}
        onChange={clearErrors}
        forgotPasswordHref="/forgot-password"
        forgotPasswordLabel={STRINGS.login.forgotPassword}
      />

      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <span className="opacity-80">{STRINGS.login.registerCtaText}</span>
        <Link className="link link-primary" to="/register">
          {STRINGS.login.registerCtaLink}
        </Link>
      </div>
    </AuthShell>
  );
}
