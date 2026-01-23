import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { LoginFormBase } from './LoginFormBase';

function TestHarness() {
  const [error, setError] = React.useState<string | null>(
    'Invalid credentials',
  );

  return (
    <LoginFormBase
      onSubmit={async () => {
        return;
      }}
      error={error}
      onChange={() => setError(null)}
    />
  );
}

describe('LoginFormBase', () => {
  test('clears error message when user changes email or password', async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    // The error is visible at first
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();

    // Typing triggers onChange -> parent clears error -> error disappears
    await user.type(screen.getByLabelText(/email/i), 'a');
    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(/password/i), 'x');
    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
  });
});
