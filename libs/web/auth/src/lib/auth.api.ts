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

/**
 * Small HTTP wrapper used by the auth client.
 *
 * Key points:
 * - `cache: 'no-store'` prevents 304 responses on auth endpoints (e.g. /me).
 * - We also set Cache-Control headers to avoid browser/proxy caching.
 * - We parse error payloads when possible for better messages.
 */
async function http<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${input}`, {
    ...init,
    // Prevent any caching for auth-sensitive endpoints.
    cache: 'no-store',

    headers: {
      'Content-Type': 'application/json',

      // Extra safety: tell intermediaries/browsers not to cache responses.
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',

      ...(init?.headers ?? {}),
    },
  });

  // Only 2xx responses are considered ok by Fetch.
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
