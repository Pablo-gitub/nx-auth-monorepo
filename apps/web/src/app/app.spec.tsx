import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './app';
import { AuthProvider } from '@assignment-ftechnology/auth';

function renderWithRouter(initialEntries: string[] = ['/login']) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithRouter();
    expect(baseElement).toBeTruthy();
  });

  it('should render the login page by default', () => {
    renderWithRouter(['/login']);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});
