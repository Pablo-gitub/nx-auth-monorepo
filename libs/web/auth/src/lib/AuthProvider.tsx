import React from 'react';
import type { AuthContextValue, AuthState, LoginPayload } from './auth.types';
import { apiLogin, apiMe } from './auth.api';
import {
  clearAccessToken,
  readAccessToken,
  writeAccessToken,
} from './token.storage';

const AuthContext = React.createContext<AuthContextValue | null>(null);

/**
 * Builds the initial auth state synchronously.
 * This prevents route-guards from redirecting to /login before we had a chance
 * to restore the session from localStorage.
 */
function buildInitialState(): AuthState {
  const token = readAccessToken();

  return {
    accessToken: token,
    user: null,
    // If we already have a token, we must validate it by calling /me.
    // During that time the app should show a loading UI, not redirect.
    status: token ? 'loading' : 'anonymous',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() =>
    buildInitialState(),
  );

  /**
   * Refreshes the current user ("me") using either the in-memory token
   * or the one stored in localStorage.
   */
  const refreshMe = React.useCallback(async () => {
    const token = state.accessToken ?? readAccessToken();

    if (!token) {
      setState(buildInitialState());
      return;
    }

    setState((s) => ({ ...s, status: 'loading', accessToken: token }));

    try {
      const me = await apiMe(token);

      setState({
        accessToken: token,
        user: me.user,
        status: 'authenticated',
      });
    } catch {
      // Token invalid/expired -> clean up and go back to anonymous.
      clearAccessToken();
      setState(buildInitialState());
    }
  }, [state.accessToken]);

  /**
   * Perform login against the API.
   *
   * Notes:
   * - Returns void (as required by AuthContextValue typing).
   * - Pages can still await it to know when it's done.
   */
  const login = React.useCallback(
    async (payload: LoginPayload): Promise<void> => {
      setState((s) => ({ ...s, status: 'loading' }));

      try {
        const res = await apiLogin(payload);

        writeAccessToken(res.accessToken, Boolean(payload.rememberMe));

        setState({
          accessToken: res.accessToken,
          user: res.user,
          status: 'authenticated',
        });

        // Do NOT return res -> keep the contract Promise<void>
      } catch (err) {
        clearAccessToken();
        setState(buildInitialState());
        throw err;
      }
    },
    [],
  );

  /**
   * Clears the session locally.
   */
  const logout = React.useCallback(() => {
    clearAccessToken();
    setState(buildInitialState());
  }, []);

  /**
   * Bootstrap: validate any existing token on app start.
   */
  React.useEffect(() => {
    void refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}

export const useAuth = useAuthContext;
