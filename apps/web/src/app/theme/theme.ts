export type ThemeName = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function getTheme(): ThemeName {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme(): ThemeName {
  const next: ThemeName = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
