import type { AuthShellProps } from '../types/auth-ui.types';

/**
 * Shared auth page shell (card + branding).
 */
export function AuthShell({ title, subtitle, logo, children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-base-200 text-base-content flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-4">
            {logo ? <div className="mb-1">{logo}</div> : null}

            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">{title}</h1>
              {subtitle ? <p className="text-sm opacity-80">{subtitle}</p> : null}
            </div>

            {/* IMPORTANT: give children full width */}
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
