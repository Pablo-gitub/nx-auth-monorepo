// apps/web/src/app/pages/RegisterPage.spec.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { RegisterPage } from './RegisterPage';

/**
 * RegisterPage smoke test:
 * - Ensures the page renders
 * - Ensures the page title is visible
 *
 * We keep this test simple and stable to avoid coupling it
 * to implementation details (form validation, API calls, etc.).
 */
describe('RegisterPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(baseElement).toBeTruthy();
  });

  it('should show the register heading', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /register/i }),
    ).toBeInTheDocument();
  });
});
