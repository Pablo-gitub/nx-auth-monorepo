import React from 'react';
import { useAuth } from '@assignment-ftechnology/auth';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../ui-tokens/strings';

/**
 * Dashboard page:
 * - Shows the authenticated user's profile
 * - Allows logging out and redirecting to /login
 */
export function DashboardPage() {
  const { user, logout, status } = useAuth();
  const navigate = useNavigate();

  const onLogout = React.useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  if (status === 'loading') {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>{STRINGS.dashboard.title}</h1>

      {user ? (
        <p>
          {STRINGS.dashboard.welcome} {user.firstName} {user.lastName}
        </p>
      ) : (
        <p>{STRINGS.dashboard.welcome}</p>
      )}

      <button onClick={onLogout}>{STRINGS.dashboard.logout}</button>
    </div>
  );
}
