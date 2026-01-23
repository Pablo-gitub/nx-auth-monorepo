// libs/web/auth-ui/src/lib/components/RegisterFormBase.tsx
import { useState } from 'react';
import type { RegisterFormValues } from '../types/auth-ui.types';

/**
 * Field-level errors supported by this form.
 * Keep this aligned with the actual inputs rendered here.
 */
export type RegisterFieldErrors = Partial<
  Record<
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'birthDate'
    | 'password'
    | 'confirmPassword',
    string
  >
>;

type Props = {
  onSubmit: (values: RegisterFormValues) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;

  /**
   * Global/server error (e.g. "Email already exists", "Something went wrong").
   * Rendered above the submit button.
   */
  error?: string | null;

  /**
   * Field-level errors (mapped by the page/controller).
   */
  fieldErrors?: RegisterFieldErrors;

  /**
   * Called whenever the user edits any field.
   * Useful to clear server errors as soon as the user retries.
   */
  onChange?: () => void;
};

export function RegisterFormBase({
  onSubmit,
  submitLabel = 'Create account',
  disabled = false,
  error = null,
  fieldErrors,
  onChange,
}: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(''); // ISO date string from <input type="date">
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Shared style for field error messages
  const fieldErrorStyle: React.CSSProperties = {
    margin: 0,
    color: 'crimson',
    fontSize: 13,
  };

  // Stable ids for aria-describedby
  const ids = {
    firstName: 'register-firstName-error',
    lastName: 'register-lastName-error',
    email: 'register-email-error',
    birthDate: 'register-birthDate-error',
    password: 'register-password-error',
    confirmPassword: 'register-confirmPassword-error',
  } as const;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        void onSubmit({
          firstName,
          lastName,
          email,
          birthDate,
          password,
          confirmPassword,
        });
      }}
      style={{ display: 'grid', gap: 12 }}
    >
      <label style={{ display: 'grid', gap: 6 }}>
        <span>First name</span>
        <input
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            onChange?.();
          }}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors?.firstName)}
          aria-describedby={fieldErrors?.firstName ? ids.firstName : undefined}
        />
        {fieldErrors?.firstName ? (
          <p id={ids.firstName} role="alert" style={fieldErrorStyle}>
            {fieldErrors.firstName}
          </p>
        ) : null}
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Last name</span>
        <input
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            onChange?.();
          }}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors?.lastName)}
          aria-describedby={fieldErrors?.lastName ? ids.lastName : undefined}
        />
        {fieldErrors?.lastName ? (
          <p id={ids.lastName} role="alert" style={fieldErrorStyle}>
            {fieldErrors.lastName}
          </p>
        ) : null}
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Email</span>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            onChange?.();
          }}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors?.email)}
          aria-describedby={fieldErrors?.email ? ids.email : undefined}
        />
        {fieldErrors?.email ? (
          <p id={ids.email} role="alert" style={fieldErrorStyle}>
            {fieldErrors.email}
          </p>
        ) : null}
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Birth date</span>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => {
            setBirthDate(e.target.value);
            onChange?.();
          }}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors?.birthDate)}
          aria-describedby={fieldErrors?.birthDate ? ids.birthDate : undefined}
        />
        {fieldErrors?.birthDate ? (
          <p id={ids.birthDate} role="alert" style={fieldErrorStyle}>
            {fieldErrors.birthDate}
          </p>
        ) : null}
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            onChange?.();
          }}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors?.password)}
          aria-describedby={fieldErrors?.password ? ids.password : undefined}
        />
        {fieldErrors?.password ? (
          <p id={ids.password} role="alert" style={fieldErrorStyle}>
            {fieldErrors.password}
          </p>
        ) : null}
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Confirm password</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            onChange?.();
          }}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors?.confirmPassword)}
          aria-describedby={
            fieldErrors?.confirmPassword ? ids.confirmPassword : undefined
          }
        />
        {fieldErrors?.confirmPassword ? (
          <p id={ids.confirmPassword} role="alert" style={fieldErrorStyle}>
            {fieldErrors.confirmPassword}
          </p>
        ) : null}
      </label>

      {error ? (
        <div role="alert" style={{ color: 'crimson' }}>
          {error}
        </div>
      ) : null}

      <button type="submit" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  );
}
