import { AuthShell, LoginFormBase } from '@assignment-ftechnology/auth-ui';

export function LoginPage() {
  return (
    <AuthShell title="Login">
      <LoginFormBase onSubmit={(v) => console.log(v)} />
    </AuthShell>
  );
}
