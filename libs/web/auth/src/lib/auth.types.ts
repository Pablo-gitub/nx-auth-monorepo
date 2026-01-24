import type {
  RegisterInput,
  UserPublicDto,
} from '@assignment-ftechnology/contracts';

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
 * PATCH /me payload (frontend side).
 * Keep aligned with contracts patchMeSchema.
 */
export type PatchMePayload = Partial<{
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
}>;

/**
 * Access history item returned by GET /me/access-history.
 */
export type AccessHistoryItem = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string; // ISO datetime
};

export type AccessHistoryResponse = {
  items: AccessHistoryItem[];
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
