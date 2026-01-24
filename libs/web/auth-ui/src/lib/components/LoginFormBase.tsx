import { useId, useState } from 'react';
import type { LoginFormValues } from '../types/auth-ui.types';

type LoginField = 'email' | 'password' | 'rememberMe';

type Props = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;

  /**
   * General (form-level) error message (e.g. server says "Invalid credentials").
   */
  error?: string | null;

  /**
   * Field-level errors (client validation or mapped server validation).
   * Keys MUST match the form fields to keep tests stable.
   */
  fieldErrors?: Partial<Record<LoginField, string>>;

  /**
   * Called whenever the user edits any field.
   * Useful to clear server errors as soon as the user retries.
   */
  onChange?: () => void;

  /**
   * Optional "Forgot password?" link (UI-only).
   */
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
};

export function LoginFormBase({
  onSubmit,
  submitLabel = 'Login',
  disabled = false,
  error = null,
  fieldErrors,
  onChange,
  forgotPasswordHref,
  forgotPasswordLabel = 'Forgot password?',
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Stable ids for aria-describedby, safe for multiple forms on same page
  const emailId = useId();
  const passwordId = useId();

  const emailError = fieldErrors?.email;
  const passwordError = fieldErrors?.password;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit({ email, password, rememberMe });
      }}
      className="grid gap-4"
    >
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Email</span>
        </div>

        <input
          id={emailId}
          name="email"
          autoComplete="email"
          className={`input input-bordered w-full ${emailError ? 'input-error' : ''}`}
          value={email}
          disabled={disabled}
          onChange={(e) => {
            setEmail(e.target.value);
            onChange?.();
          }}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? `${emailId}-error` : undefined}
        />

        {emailError ? (
          <div className="label">
            <span
              id={`${emailId}-error`}
              role="alert"
              className="label-text-alt text-error"
            >
              {emailError}
            </span>
          </div>
        ) : null}
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Password</span>
        </div>

        <input
          id={passwordId}
          name="password"
          autoComplete="current-password"
          type="password"
          className={`input input-bordered w-full ${passwordError ? 'input-error' : ''}`}
          value={password}
          disabled={disabled}
          onChange={(e) => {
            setPassword(e.target.value);
            onChange?.();
          }}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? `${passwordId}-error` : undefined}
        />

        {passwordError ? (
          <div className="label">
            <span
              id={`${passwordId}-error`}
              role="alert"
              className="label-text-alt text-error"
            >
              {passwordError}
            </span>
          </div>
        ) : null}
      </label>

      <div className="flex items-center justify-between gap-4">
        <label className="label cursor-pointer gap-2 p-0">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={rememberMe}
            disabled={disabled}
            onChange={(e) => {
              setRememberMe(e.target.checked);
              onChange?.();
            }}
          />

          <span className="label-text">Remember me</span>
        </label>

        {forgotPasswordHref ? (
          <a className="link link-hover text-sm" href={forgotPasswordHref}>
            {forgotPasswordLabel}
          </a>
        ) : null}
      </div>

      {error ? (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="btn btn-primary w-full"
      >
        {submitLabel}
      </button>
    </form>
  );
}
