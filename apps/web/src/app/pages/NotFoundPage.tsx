import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404</h1>
      <Link to="/login">Go to login</Link>
    </div>
  );
}
