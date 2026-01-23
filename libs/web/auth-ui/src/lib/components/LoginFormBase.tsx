import { useId, useState } from 'react';
import type { LoginFormValues } from '../types/auth-ui.types';

type LoginField = 'email' | 'password' | 'rememberMe';

type Props = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;

  /**
   * General (form-level) error message (e.g. server says "Invalid credentials").
   */
  error?: string | null;

  /**
   * Field-level errors (client validation or mapped server validation).
   * Keys MUST match the form fields to keep tests stable.
   */
  fieldErrors?: Partial<Record<LoginField, string>>;

  /**
   * Called whenever the user edits any field.
   * Useful to clear server errors as soon as the user retries.
   */
  onChange?: () => void;

  /**
   * Optional "Forgot password?" link (UI-only).
   */
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
};

export function LoginFormBase({
  onSubmit,
  submitLabel = 'Login',
  disabled = false,
  error = null,
  fieldErrors,
  onChange,
  forgotPasswordHref,
  forgotPasswordLabel = 'Forgot password?',
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Stable ids for aria-describedby, safe for multiple forms on same page
  const emailId = useId();
  const passwordId = useId();

  const emailError = fieldErrors?.email;
  const passwordError = fieldErrors?.password;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit({ email, password, rememberMe });
      }}
      style={{ display: 'grid', gap: 12 }}
    >
      <label style={{ display: 'grid', gap: 6 }}>
        <span>Email</span>
        <input
          value={email}
          disabled={disabled}
          onChange={(e) => {
            setEmail(e.target.value);
            onChange?.();
          }}
          // Accessibility: mark invalid and point to error text
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? `${emailId}-error` : undefined}
        />
        {emailError ? (
          <p id={`${emailId}-error`} role="alert" style={{ margin: 0 }}>
            {emailError}
          </p>
        ) : null}
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          disabled={disabled}
          onChange={(e) => {
            setPassword(e.target.value);
            onChange?.();
          }}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? `${passwordId}-error` : undefined}
        />
        {passwordError ? (
          <p id={`${passwordId}-error`} role="alert" style={{ margin: 0 }}>
            {passwordError}
          </p>
        ) : null}
      </label>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={disabled}
            onChange={(e) => {
              setRememberMe(e.target.checked);
              onChange?.();
            }}
          />
          <span>Remember me</span>
        </label>

        {forgotPasswordHref ? (
          <a href={forgotPasswordHref} style={{ fontSize: 14, opacity: 0.85 }}>
            {forgotPasswordLabel}
          </a>
        ) : null}
      </div>

      {/* General error (server/global) */}
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
