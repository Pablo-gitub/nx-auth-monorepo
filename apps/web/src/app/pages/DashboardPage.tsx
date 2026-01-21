import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Welcome {user?.firstName} {user?.lastName}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
