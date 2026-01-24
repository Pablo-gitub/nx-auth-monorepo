const KEY = 'auth.accessToken';

/**
 * Read the access token from storage:
 * - Prefer localStorage (persistent)
 * - Fallback to sessionStorage (tab-lifetime)
 */
export function readAccessToken(): string | null {
  try {
    return localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * Store the access token depending on rememberMe:
 * - rememberMe = true  -> localStorage (persists across browser restarts)
 * - rememberMe = false -> sessionStorage (cleared when tab/window closes)
 */
export function writeAccessToken(token: string, rememberMe: boolean): void {
  clearAccessToken();

  if (rememberMe) {
    localStorage.setItem(KEY, token);
  } else {
    sessionStorage.setItem(KEY, token);
  }
}

/**
 * Clear the access token from storage.
 */
export function clearAccessToken(): void {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    // no-op (storage might be blocked)
  }
}
