import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  apiUploadAvatar,
  resolveAssetUrl,
  useAuth,
} from '@assignment-ftechnology/auth';
import { apiAccessHistory, apiPatchMe } from '@assignment-ftechnology/auth';
import type {
  AccessHistoryItem,
  PatchMePayload,
} from '@assignment-ftechnology/auth';

import { STRINGS } from '../ui-tokens/strings';
import { toast } from 'react-toastify';

/**
 * Dashboard page:
 * - Protected route (requires auth)
 * - Shows profile summary
 * - Allows editing profile fields via PATCH /me
 * - Shows last 5 access log entries via GET /me/access-history
 */
export function DashboardPage() {
  const { user, accessToken, logout, refreshMe, status } = useAuth();
  const navigate = useNavigate();

  // Local edit form state (initialized from user when available)
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [birthDate, setBirthDate] = React.useState(''); // YYYY-MM-DD

  // UI state
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving'>('idle');
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);

  const [historyStatus, setHistoryStatus] = React.useState<
    'idle' | 'loading' | 'error'
  >('idle');
  const [historyError, setHistoryError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<AccessHistoryItem[]>([]);

  const isSaving = saveStatus === 'saving';
  const avatarSrc = (() => {
    const base = resolveAssetUrl(user?.avatarUrl);
    if (!base) return null;
    // bust cache using updatedAt if available, otherwise Date.now()
    const v = user?.updatedAt
      ? encodeURIComponent(user.updatedAt)
      : String(Date.now());
    return `${base}?v=${v}`;
  })();

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarStatus, setAvatarStatus] = React.useState<'idle' | 'uploading'>(
    'idle',
  );
  const [avatarError, setAvatarError] = React.useState<string | null>(null);

  const onUploadAvatar = async () => {
    if (!accessToken || !avatarFile) return;

    setAvatarStatus('uploading');
    setAvatarError(null);

    try {
      await apiUploadAvatar(accessToken, avatarFile);
      await refreshMe();
      toast.success('Avatar uploaded successfully');
    } catch (e) {
      toast.error('Failed to upload avatar');
      setAvatarError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setAvatarStatus('idle');
    }
  };

  const onLogout = React.useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const onGoDashboard = React.useCallback(() => {
    navigate('/dashboard', { replace: false });
  }, [navigate]);

  const onGoProfile = React.useCallback(() => {
    // Simple in-page navigation: no extra route needed
    document
      .getElementById('profile-edit')
      ?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => 'light');

  React.useEffect(() => {
    setTheme(
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light',
    );
  }, []);

  // Keep local form in sync with current user (on first load + refreshMe)
  React.useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName ?? '');
    setLastName(user.lastName ?? '');
    setBirthDate(user.birthDate ?? '');
  }, [user]);

  const loadHistory = React.useCallback(async () => {
    if (!accessToken) return;

    setHistoryStatus('loading');
    setHistoryError(null);

    try {
      const res = await apiAccessHistory(accessToken, 5);
      setHistory(res.items);
      setHistoryStatus('idle');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load history';
      setHistoryError(message);
      setHistoryStatus('error');
    }
  }, [accessToken]);

  // Load access history when authenticated
  React.useEffect(() => {
    if (status !== 'authenticated' || !accessToken) return;
    void loadHistory();
  }, [status, accessToken, loadHistory]);

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaveError(null);
    setSaveSuccess(null);

    if (!accessToken) {
      setSaveError(STRINGS.dashboard.notAuthenticated);
      return;
    }

    // Build a minimal patch (send only changed fields)
    const patch: PatchMePayload = {};
    if (user?.firstName !== firstName) patch.firstName = firstName;
    if (user?.lastName !== lastName) patch.lastName = lastName;
    if (user?.birthDate !== birthDate) patch.birthDate = birthDate;

    if (Object.keys(patch).length === 0) {
      setSaveSuccess(STRINGS.dashboard.noChanges);
      return;
    }

    setSaveStatus('saving');

    try {
      await apiPatchMe(accessToken, patch);

      // Refresh global auth state from /me (source of truth)
      await refreshMe();

      // Optionally refresh history too (not required, but nice)
      await loadHistory();
      toast.success('Profile updated successfully');
      setSaveSuccess(STRINGS.dashboard.profileUpdated);
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';

      // Friendly mapping for common cases
      const friendly =
        raw.toLowerCase().includes('at least one field') ||
        raw.toLowerCase().includes('no changes')
          ? STRINGS.dashboard.noChanges
          : STRINGS.dashboard.updateFailed;
      toast.error('Failed to update profile');
      setSaveError(friendly);
    } finally {
      setSaveStatus('idle');
    }
  };

  if (status === 'loading') {
    return <div style={{ padding: 24 }}>{STRINGS.common.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          {/* Brand */}
          <button
            type="button"
            onClick={onGoDashboard}
            className="flex items-center gap-3"
            aria-label={STRINGS.brand.name}
          >
            <div className="avatar placeholder">
              <div className="w-9 rounded-xl bg-primary text-primary-content">
                <span className="font-bold">F</span>
              </div>
            </div>

            <div className="leading-tight text-left">
              <div className="font-semibold">{STRINGS.brand.name}</div>
              <div className="text-xs opacity-70">
                {user ? `${user.firstName} ${user.lastName}` : ''}
              </div>
            </div>
          </button>

          {/* Menu */}
          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoDashboard}
              className="btn btn-ghost btn-sm"
            >
              {STRINGS.dashboard.navDashboard}
            </button>

            <button
              type="button"
              onClick={onGoProfile}
              className="btn btn-ghost btn-sm"
            >
              {STRINGS.dashboard.navProfile}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="btn btn-outline btn-sm"
            >
              {STRINGS.dashboard.logout}
            </button>

            <label className="swap swap-rotate btn btn-ghost btn-sm">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={() => {
                  const next = theme === 'dark' ? 'light' : 'dark';
                  document.documentElement.setAttribute('data-theme', next);
                  localStorage.setItem('theme', next);
                  setTheme(next);
                }}
                aria-label="Toggle theme"
              />
              {/* sun */}
              <svg
                className="swap-off h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" />
              </svg>
              {/* moon */}
              <svg
                className="swap-on h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3 7 7 0 1 0 21 12.8Z" />
              </svg>
            </label>
          </nav>
        </div>
      </header>

      {/* Page container */}
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6">
        {/* Profile summary */}
        <section className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <h2 className="card-title">{STRINGS.dashboard.profileTitle}</h2>

            <div className="flex items-start gap-4">
              {avatarSrc ? (
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
                    <img src={avatarSrc} alt={STRINGS.dashboard.avatarAlt} />
                  </div>
                </div>
              ) : null}

              <div className="grid gap-2">
                <div>
                  <span className="font-semibold">
                    {STRINGS.dashboard.nameLabel}
                  </span>{' '}
                  {user ? `${user.firstName} ${user.lastName}` : '-'}
                </div>
                <div>
                  <span className="font-semibold">
                    {STRINGS.dashboard.emailLabel}
                  </span>{' '}
                  {user?.email ?? '-'}
                </div>
                <div>
                  <span className="font-semibold">
                    {STRINGS.dashboard.birthDateLabel}
                  </span>{' '}
                  {user?.birthDate ?? '-'}
                </div>
              </div>
            </div>

            <div className="divider my-0" />

            <div className="grid gap-3 max-w-md">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="file-input file-input-bordered w-full"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setAvatarFile(f);
                  setAvatarError(null);
                }}
                disabled={avatarStatus === 'uploading'}
              />

              <button
                type="button"
                onClick={onUploadAvatar}
                disabled={!avatarFile || avatarStatus === 'uploading'}
                className="btn btn-primary"
              >
                {avatarStatus === 'uploading'
                  ? STRINGS.dashboard.avatarUploading
                  : STRINGS.dashboard.avatarUpload}
              </button>

              {avatarError ? (
                <div role="alert" className="alert alert-error">
                  <span>{avatarError}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Edit profile */}
        <section id="profile-edit" className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <h2 className="card-title">{STRINGS.dashboard.editTitle}</h2>

            <form onSubmit={onSaveProfile} className="grid gap-4 max-w-md">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">
                    {STRINGS.dashboard.firstNameLabel}
                  </span>
                </div>
                <input
                  className="input input-bordered"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setSaveError(null);
                    setSaveSuccess(null);
                  }}
                  disabled={isSaving}
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text">
                    {STRINGS.dashboard.lastNameLabel}
                  </span>
                </div>
                <input
                  className="input input-bordered"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setSaveError(null);
                    setSaveSuccess(null);
                  }}
                  disabled={isSaving}
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text">
                    {STRINGS.dashboard.birthDateLabel}
                  </span>
                </div>
                <input
                  type="date"
                  className="input input-bordered"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    setSaveError(null);
                    setSaveSuccess(null);
                  }}
                  disabled={isSaving}
                />
              </label>

              {saveError ? (
                <div role="alert" className="alert alert-error">
                  <span>{saveError}</span>
                </div>
              ) : null}

              {saveSuccess ? (
                <div role="status" className="alert alert-success">
                  <span>{saveSuccess}</span>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
              >
                {isSaving ? STRINGS.dashboard.saving : STRINGS.dashboard.save}
              </button>
            </form>
          </div>
        </section>

        {/* Access history */}
        <section className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <h2 className="card-title">{STRINGS.dashboard.historyTitle}</h2>

            {historyStatus === 'loading' ? (
              <div className="loading loading-spinner" />
            ) : null}

            {historyStatus === 'error' && historyError ? (
              <div role="alert" className="alert alert-error">
                <span>{STRINGS.dashboard.historyFailed}</span>
              </div>
            ) : null}

            {historyStatus !== 'loading' && history.length === 0 ? (
              <div className="opacity-80">{STRINGS.dashboard.historyEmpty}</div>
            ) : null}

            {history.length > 0 ? (
              <ul className="timeline timeline-vertical">
                {history.map((h) => (
                  <li key={h.id}>
                    <div className="timeline-start text-xs opacity-70">
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                    <div className="timeline-middle">
                      <div className="badge badge-neutral badge-sm" />
                    </div>
                    <div className="timeline-end">
                      <div className="text-sm">
                        {h.ipAddress ?? STRINGS.dashboard.historyUnknownIp} ·{' '}
                        {h.userAgent ?? STRINGS.dashboard.historyUnknownAgent}
                      </div>
                    </div>
                    <hr />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
