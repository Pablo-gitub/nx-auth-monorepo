import { useState } from 'react';
import type { LoginFormValues } from '../types/auth-ui.types';

type Props = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
  error?: string | null;
};

export function LoginFormBase({
  onSubmit,
  submitLabel = 'Login',
  disabled = false,
  error = null,
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

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={disabled}
        />
        <span>Remember me</span>
      </label>

      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}

      <button type="submit" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  );
}
