import type { LoginPayload, LoginResponse, AuthUser } from './auth.types';

const DEFAULT_API_URL = 'http://localhost:3000/api';

let API_URL = DEFAULT_API_URL;

/**
 * Configure the API base URL at runtime (from the host app).
 * Call this once at app bootstrap.
 */
export function setApiBaseUrl(url?: string) {
  const trimmed = (url ?? '').trim();
  if (trimmed.length > 0) {
    API_URL = trimmed;
  }
}

async function http<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${input}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message ?? `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
  return http<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function apiMe(accessToken: string): Promise<{ user: AuthUser }> {
  return http<{ user: AuthUser }>('/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
