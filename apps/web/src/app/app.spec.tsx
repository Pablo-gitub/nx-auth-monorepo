import { render, screen } from '@testing-library/react';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the login page by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});
