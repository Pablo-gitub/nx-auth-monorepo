import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

jest.mock('@assignment-ftechnology/auth', () => ({
  useAuth: () => ({
    status: 'anonymous',
    accessToken: null,
  }),
}));

describe('ProtectedRoute', () => {
  it('redirects to /login when user is not authenticated', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<h1>Login</h1>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Dashboard</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});
