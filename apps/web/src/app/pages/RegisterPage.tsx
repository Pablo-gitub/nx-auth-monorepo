// apps/web/src/app/pages/RegisterPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthShell, RegisterFormBase } from '@assignment-ftechnology/auth-ui';
import type { RegisterFieldErrors } from '@assignment-ftechnology/auth-ui';

import { apiRegister } from '@assignment-ftechnology/auth';
import { registerSchema } from '@assignment-ftechnology/contracts';

import { STRINGS } from '../ui-tokens/strings';
import { z } from 'zod';

/**
 * Utility: maps Zod issues to fieldErrors for the form.
 * Zod paths are PropertyKey[] (string | number | symbol), so we normalize safely.
 */
function mapZodIssuesToFieldErrors(issues: z.ZodIssue[]): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  for (const issue of issues) {
    const rawKey = issue.path[0];

    // Normalize PropertyKey -> string (ignore symbols)
    const key = typeof rawKey === 'symbol' ? '' : String(rawKey);

    if (
      key === 'firstName' ||
      key === 'lastName' ||
      key === 'email' ||
      key === 'birthDate' ||
      key === 'password' ||
      key === 'confirmPassword'
    ) {
      // Keep first error per field
      if (!errors[key]) {
        errors[key] = issue.message;
      }
    }
  }

  return errors;
}


export function RegisterPage() {
  const navigate = useNavigate();

  const [status, setStatus] = React.useState<'idle' | 'loading'>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<RegisterFieldErrors>({});

  const disabled = status === 'loading';

  const clearErrors = React.useCallback(() => {
    if (error) setError(null);
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }, [error, fieldErrors]);

  const onSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    password: string;
    confirmPassword: string;
  }) => {
    setError(null);
    setFieldErrors({});

    // Client-side validation using the shared contract schema
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error.issues));
      return;
    }

    setStatus('loading');

    try {
      await apiRegister(parsed.data);

      // Register completed -> redirect to login
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';

      // Optional: map common API errors to user-friendly copy
      const friendly =
        message.toLowerCase().includes('409') ||
        message.toLowerCase().includes('conflict')
          ? STRINGS.register.emailAlreadyExists
          : STRINGS.register.genericRegisterError;

      setError(friendly);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <AuthShell title={STRINGS.register.title} subtitle={STRINGS.register.subtitle}>
      <RegisterFormBase
        onSubmit={onSubmit}
        disabled={disabled}
        error={error}
        fieldErrors={fieldErrors}
        onChange={clearErrors}
        submitLabel={disabled ? STRINGS.register.submitting : STRINGS.register.submit}
      />

      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ opacity: 0.85 }}>{STRINGS.register.loginCtaText}</span>
        <Link to="/login">{STRINGS.register.loginCtaLink}</Link>
      </div>
    </AuthShell>
  );
}
