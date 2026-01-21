import React from 'react';
import type { AuthContextValue, AuthState, LoginPayload } from './auth.types';
import { apiLogin, apiMe } from './auth.api';
import { clearAccessToken, readAccessToken, writeAccessToken } from './token.storage';

const AuthContext = React.createContext<AuthContextValue | null>(null);

const initialState: AuthState = {
  accessToken: null,
  user: null,
  status: 'anonymous',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(initialState);

  const refreshMe = React.useCallback(async () => {
    const token = state.accessToken ?? readAccessToken();
    if (!token) {
      setState({ ...initialState });
      return;
    }

    setState((s) => ({ ...s, status: 'loading', accessToken: token }));

    const me = await apiMe(token);
    setState({
      accessToken: token,
      user: me.user,
      status: 'authenticated',
    });
  }, [state.accessToken]);

  const login = React.useCallback(async (payload: LoginPayload) => {
    setState((s) => ({ ...s, status: 'loading' }));

    const res = await apiLogin(payload);
    writeAccessToken(res.accessToken);

    setState({
      accessToken: res.accessToken,
      user: res.user,
      status: 'authenticated',
    });
  }, []);

  const logout = React.useCallback(() => {
    clearAccessToken();
    setState({ ...initialState });
  }, []);

  // Bootstrap: prova a ripristinare sessione da localStorage
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
