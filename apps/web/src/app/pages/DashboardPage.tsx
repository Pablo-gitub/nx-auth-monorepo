import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@assignment-ftechnology/auth';
import { apiAccessHistory, apiPatchMe } from '@assignment-ftechnology/auth';
import type {
  AccessHistoryItem,
  PatchMePayload,
} from '@assignment-ftechnology/auth';

import { STRINGS } from '../ui-tokens/strings';

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

  const onLogout = React.useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

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

      setSaveSuccess(STRINGS.dashboard.profileUpdated);
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';

      // Friendly mapping for common cases
      const friendly =
        raw.toLowerCase().includes('at least one field') ||
        raw.toLowerCase().includes('no changes')
          ? STRINGS.dashboard.noChanges
          : STRINGS.dashboard.updateFailed;

      setSaveError(friendly);
    } finally {
      setSaveStatus('idle');
    }
  };

  if (status === 'loading') {
    return <div style={{ padding: 24 }}>{STRINGS.common.loading}</div>;
  }

  return (
    <div style={{ padding: 24, display: 'grid', gap: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>{STRINGS.dashboard.title}</h1>
        <button onClick={onLogout}>{STRINGS.dashboard.logout}</button>
      </header>

      {/* Profile summary */}
      <section style={{ display: 'grid', gap: 8 }}>
        <h2 style={{ margin: 0 }}>{STRINGS.dashboard.profileTitle}</h2>

        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={STRINGS.dashboard.avatarAlt}
            style={{ width: 72, height: 72, borderRadius: 999, objectFit: 'cover' }}
          />
        ) : null}

        <div style={{ display: 'grid', gap: 4 }}>
          <div>
            <strong>{STRINGS.dashboard.nameLabel}</strong>{' '}
            {user ? `${user.firstName} ${user.lastName}` : '-'}
          </div>
          <div>
            <strong>{STRINGS.dashboard.emailLabel}</strong>{' '}
            {user?.email ?? '-'}
          </div>
          <div>
            <strong>{STRINGS.dashboard.birthDateLabel}</strong>{' '}
            {user?.birthDate ?? '-'}
          </div>
        </div>
      </section>

      {/* Edit profile */}
      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>{STRINGS.dashboard.editTitle}</h2>

        <form onSubmit={onSaveProfile} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>{STRINGS.dashboard.firstNameLabel}</span>
            <input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setSaveError(null);
                setSaveSuccess(null);
              }}
              disabled={isSaving}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>{STRINGS.dashboard.lastNameLabel}</span>
            <input
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setSaveError(null);
                setSaveSuccess(null);
              }}
              disabled={isSaving}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>{STRINGS.dashboard.birthDateLabel}</span>
            <input
              type="date"
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
            <div role="alert" style={{ color: 'crimson' }}>
              {saveError}
            </div>
          ) : null}

          {saveSuccess ? (
            <div role="status" style={{ color: 'green' }}>
              {saveSuccess}
            </div>
          ) : null}

          <button type="submit" disabled={isSaving}>
            {isSaving ? STRINGS.dashboard.saving : STRINGS.dashboard.save}
          </button>
        </form>
      </section>

      {/* Access history */}
      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>{STRINGS.dashboard.historyTitle}</h2>

        {historyStatus === 'loading' ? (
          <div>{STRINGS.common.loading}</div>
        ) : null}

        {historyStatus === 'error' && historyError ? (
          <div role="alert" style={{ color: 'crimson' }}>
            {STRINGS.dashboard.historyFailed}
          </div>
        ) : null}

        {historyStatus !== 'loading' && history.length === 0 ? (
          <div style={{ opacity: 0.85 }}>{STRINGS.dashboard.historyEmpty}</div>
        ) : null}

        {history.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
            {history.map((h) => (
              <li key={h.id}>
                <div>
                  <strong>{new Date(h.createdAt).toLocaleString()}</strong>
                </div>
                <div style={{ opacity: 0.85 }}>
                  {h.ipAddress ?? STRINGS.dashboard.historyUnknownIp} ·{' '}
                  {h.userAgent ?? STRINGS.dashboard.historyUnknownAgent}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
