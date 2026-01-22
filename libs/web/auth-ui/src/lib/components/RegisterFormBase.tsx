import { useState } from 'react';
import type { RegisterFormValues } from '../types/auth-ui.types';

type Props = {
  onSubmit: (values: RegisterFormValues) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
  error?: string | null;
};

export function RegisterFormBase({
  onSubmit,
  submitLabel = 'Continue',
  disabled = false,
  error = null,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={disabled} />
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={disabled}
        />
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Confirm password</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={disabled}
        />
      </label>

      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}

      <button type="submit" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  );
}
