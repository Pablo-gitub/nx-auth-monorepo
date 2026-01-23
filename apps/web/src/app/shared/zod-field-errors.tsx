import type { ZodError } from 'zod';

/**
 * Convert a ZodError into a fieldErrors map suitable for form components.
 * The first error per field wins (keeps UI stable and avoids noise).
 */
export function zodToFieldErrors<TField extends string>(
  error: ZodError,
): Partial<Record<TField, string>> {
  const out: Partial<Record<TField, string>> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string') {
      const field = key as TField;
      if (!out[field]) out[field] = issue.message;
    }
  }

  return out;
}
