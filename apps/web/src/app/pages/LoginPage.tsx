import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('paolo@example.com');
  const [password, setPassword] = useState('Password1');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TEMP: fake login (Step 7 colleghiamo API Nest)
    login({
      accessToken: 'DEV_TOKEN',
      user: {
        id: 'dev-user',
        email,
        firstName: 'Paolo',
        lastName: 'Pietrelli',
      },
    });

    navigate('/dashboard', { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Password
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
