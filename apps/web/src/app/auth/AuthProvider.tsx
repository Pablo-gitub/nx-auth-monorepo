import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (payload: { accessToken: string; user: AuthUser }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'auth';

type StoredAuth = {
  accessToken: string;
  user: AuthUser;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // hydrate from localStorage (one-time)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredAuth;

      if (parsed?.accessToken && parsed?.user?.id) {
        setAccessToken(parsed.accessToken);
        setUser(parsed.user);
      }
    } catch {
      // if storage is corrupted, reset it
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = (payload: { accessToken: string; user: AuthUser }) => {
    setAccessToken(payload.accessToken);
    setUser(payload.user);
    const stored: StoredAuth = { accessToken: payload.accessToken, user: payload.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      logout,
    }),
    [user, accessToken],
  );

  return children ? <AuthContext.Provider value={value}>{children}</AuthContext.Provider> : null;
}
