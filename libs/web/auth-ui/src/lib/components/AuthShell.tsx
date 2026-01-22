import type { AuthShellProps } from '../types/auth-ui.types';

export function AuthShell({ title, subtitle, logo, children }: AuthShellProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {logo ? <div style={{ marginBottom: 16 }}>{logo}</div> : null}

        <h1 style={{ margin: 0, fontSize: 28 }}>{title}</h1>
        {subtitle ? <p style={{ marginTop: 8, opacity: 0.8 }}>{subtitle}</p> : null}

        <div style={{ marginTop: 24 }}>{children}</div>
      </div>
    </div>
  );
}
