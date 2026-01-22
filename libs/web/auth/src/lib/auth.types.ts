import type { UserPublicDto } from '@assignment-ftechnology/contracts';

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

export type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};
