import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthShell, RegisterFormBase } from '@assignment-ftechnology/auth-ui';
import type { RegisterFormValues } from '@assignment-ftechnology/auth-ui';
import { apiRegister } from '@assignment-ftechnology/auth';
import { registerSchema } from '@assignment-ftechnology/contracts';

import { STRINGS } from '../ui-tokens/strings';
import { zodToFieldErrors } from '../shared/zod-field-errors';

type ExtraField = 'firstName' | 'lastName' | 'birthDate';
type BaseField = 'email' | 'password' | 'confirmPassword';

type FormState = {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date string
};

export function RegisterPage() {
  const navigate = useNavigate();

  const [extra, setExtra] = React.useState<FormState>({
    firstName: '',
    lastName: '',
    birthDate: '',
  });

  const [status, setStatus] = React.useState<'idle' | 'loading'>('idle');
  const [error, setError] = React.useState<string | null>(null);

  // Split field errors: "extra" fields handled here, base fields passed to RegisterFormBase
  const [extraFieldErrors, setExtraFieldErrors] = React.useState<
    Partial<Record<ExtraField, string>>
  >({});
  const [baseFieldErrors, setBaseFieldErrors] = React.useState<
    Partial<Record<BaseField, string>>
  >({});

  const disabled = status === 'loading';

  const clearErrors = () => {
    setError(null);
    setExtraFieldErrors({});
    setBaseFieldErrors({});
  };

  const setExtraField =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setExtra((s) => ({ ...s, [key]: e.target.value }));
      clearErrors();
    };

  const onSubmit = async (values: RegisterFormValues) => {
    clearErrors();

    const payload = {
      firstName: extra.firstName,
      lastName: extra.lastName,
      birthDate: extra.birthDate,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      const all = zodToFieldErrors<
        ExtraField | BaseField
      >(parsed.error);

      // Route errors to the correct bucket
      setExtraFieldErrors({
        firstName: all.firstName,
        lastName: all.lastName,
        birthDate: all.birthDate,
      });

      setBaseFieldErrors({
        email: all.email,
        password: all.password,
        confirmPassword: all.confirmPassword,
      });

      return;
    }

    setStatus('loading');

    try {
      await apiRegister(parsed.data);
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : '';

      // Minimal mapping: if backend returns 409, show email field error
      if (rawMessage.toLowerCase().includes('409')) {
        setBaseFieldErrors({ email: 'Email already exists.' });
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setStatus('idle');
    }
  };

  const firstNameErrorId = 'register-firstname-error';
  const lastNameErrorId = 'register-lastname-error';
  const birthDateErrorId = 'register-birthdate-error';

  return (
    <AuthShell title={STRINGS.register.title} subtitle={STRINGS.register.subtitle}>
      <div style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>{STRINGS.register.firstName}</span>
          <input
            value={extra.firstName}
            onChange={setExtraField('firstName')}
            disabled={disabled}
            aria-invalid={Boolean(extraFieldErrors.firstName)}
            aria-describedby={extraFieldErrors.firstName ? firstNameErrorId : undefined}
          />
          {extraFieldErrors.firstName ? (
            <p id={firstNameErrorId} role="alert" style={{ margin: 0 }}>
              {extraFieldErrors.firstName}
            </p>
          ) : null}
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>{STRINGS.register.lastName}</span>
          <input
            value={extra.lastName}
            onChange={setExtraField('lastName')}
            disabled={disabled}
            aria-invalid={Boolean(extraFieldErrors.lastName)}
            aria-describedby={extraFieldErrors.lastName ? lastNameErrorId : undefined}
          />
          {extraFieldErrors.lastName ? (
            <p id={lastNameErrorId} role="alert" style={{ margin: 0 }}>
              {extraFieldErrors.lastName}
            </p>
          ) : null}
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>{STRINGS.register.birthDate}</span>
          <input
            type="date"
            value={extra.birthDate}
            onChange={setExtraField('birthDate')}
            disabled={disabled}
            aria-invalid={Boolean(extraFieldErrors.birthDate)}
            aria-describedby={extraFieldErrors.birthDate ? birthDateErrorId : undefined}
          />
          {extraFieldErrors.birthDate ? (
            <p id={birthDateErrorId} role="alert" style={{ margin: 0 }}>
              {extraFieldErrors.birthDate}
            </p>
          ) : null}
        </label>

        <RegisterFormBase
          onSubmit={onSubmit}
          disabled={disabled}
          error={error}
          fieldErrors={baseFieldErrors}
          onChange={clearErrors}
          submitLabel={disabled ? STRINGS.register.submitting : STRINGS.register.submit}
        />
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ opacity: 0.85 }}>{STRINGS.register.loginCtaText}</span>
        <Link to="/login">{STRINGS.register.loginCtaLink}</Link>
      </div>
    </AuthShell>
  );
}
