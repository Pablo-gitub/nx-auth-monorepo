// libs/web/auth-ui/src/lib/components/LoginFormBase.tsx
import { useState } from 'react';
import type { LoginFormValues } from '../types/auth-ui.types';

type Props = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
  error?: string | null;

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
  onChange,
  forgotPasswordHref,
  forgotPasswordLabel = 'Forgot password?',
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
          onChange={(e) => {
            setEmail(e.target.value);
            onChange?.();
          }}
          disabled={disabled}
        />
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
        />
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
            onChange={(e) => {
              setRememberMe(e.target.checked);
              onChange?.();
            }}
            disabled={disabled}
          />
          <span>Remember me</span>
        </label>

        {forgotPasswordHref ? (
          <a href={forgotPasswordHref} style={{ fontSize: 14, opacity: 0.85 }}>
            {forgotPasswordLabel}
          </a>
        ) : null}
      </div>

      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}

      <button type="submit" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  );
}
