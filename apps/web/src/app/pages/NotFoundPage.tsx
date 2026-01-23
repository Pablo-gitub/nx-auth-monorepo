import { Link } from 'react-router-dom';
import { STRINGS } from '../ui-tokens/strings';

export function NotFoundPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>{STRINGS.notFound.errorCode}</h1>
      <Link to="/login">{STRINGS.notFound.goToLogin}</Link>
    </div>
  );
}
