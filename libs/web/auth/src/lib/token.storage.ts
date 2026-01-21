const KEY = 'auth.accessToken';

export function readAccessToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function writeAccessToken(token: string): void {
  localStorage.setItem(KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(KEY);
}
