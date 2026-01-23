import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';

type RouterState = {
  from?: {
    pathname: string;
  };
};

// Mock the shared auth hook
jest.mock('@assignment-ftechnology/auth', () => ({
  useAuth: () => ({
    status: 'anonymous',
    accessToken: null,
    user: null,
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn(),
    refreshMe: jest.fn(),
  }),
}));

describe('LoginPage redirect', () => {
  it('redirects to "from" path after successful login', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/login',
            state: {
              from: { pathname: '/dashboard' },
            } satisfies RouterState,
          },
        ]}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'paolo@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // After login, dashboard should render
    expect(
      await screen.findByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });
});
