import { useState } from 'react';
import type { RegisterFormValues } from '../types/auth-ui.types';

/**
 * Field-level errors supported by this form.
 * Keep this aligned with the actual inputs rendered here.
 */
export type RegisterFieldErrors = Partial<
  Record<'email' | 'password' | 'confirmPassword', string>
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
  submitLabel = 'Continue',
  disabled = false,
  error = null,
  fieldErrors,
  onChange,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const emailErrorId = 'register-email-error';
  const passwordErrorId = 'register-password-error';
  const confirmErrorId = 'register-confirm-password-error';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit({ email, password, confirmPassword });
      }}
      style={{ display: 'grid', gap: 12 }}
    >
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
          aria-describedby={fieldErrors?.email ? emailErrorId : undefined}
        />
        {fieldErrors?.email ? (
          <p id={emailErrorId} role="alert" style={{ margin: 0 }}>
            {fieldErrors.email}
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
          aria-describedby={fieldErrors?.password ? passwordErrorId : undefined}
        />
        {fieldErrors?.password ? (
          <p id={passwordErrorId} role="alert" style={{ margin: 0 }}>
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
          aria-describedby={fieldErrors?.confirmPassword ? confirmErrorId : undefined}
        />
        {fieldErrors?.confirmPassword ? (
          <p id={confirmErrorId} role="alert" style={{ margin: 0 }}>
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
