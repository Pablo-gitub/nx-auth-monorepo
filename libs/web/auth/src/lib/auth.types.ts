import type { RegisterInput, UserPublicDto } from '@assignment-ftechnology/contracts';

export type AuthUser = UserPublicDto;

export type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  status: 'anonymous' | 'loading' | 'authenticated';
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

/**
 * Register payload is shared with the backend contract (Zod schema).
 * We intentionally keep avatarUrl optional and we do NOT send it for now.
 */
export type RegisterPayload = RegisterInput;

export type RegisterResponse = {
  user: AuthUser;
};

export type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};