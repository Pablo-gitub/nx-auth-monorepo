import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './app';

function renderWithRouter(initialEntries: string[] = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
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
