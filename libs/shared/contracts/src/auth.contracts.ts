import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name is too long'),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Last name is too long'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Email is not valid')
      .max(255, 'Email is too long'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),

    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required')
      .min(8, 'Confirm password must be at least 8 characters'),

    birthDate: z
      .string()
      .min(1, 'Birth date is required'), // ISO date string from FE

    avatarUrl: z.string().url('Avatar URL is not valid').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email is not valid')
    .max(255, 'Email is too long'),

  password: z.string().min(1, 'Password is required'),

  rememberMe: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type UserPublicDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Profile update payload (PATCH /me).
 * All fields are optional because this is a partial update.
 */
export const updateMeSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  birthDate: z.string().min(1).optional(), // keep ISO date string for now
  avatarUrl: z.string().url().optional(),
});

/**
 * Profile update payload (PATCH /me):
 * - Only editable profile fields (no email, no password, no avatarUrl).
 * - All fields are optional, but at least one must be provided.
 */
export const patchMeSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name is too long')
      .optional(),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Last name is too long')
      .optional(),

    birthDate: z
      .string()
      .min(1, 'Birth date is required')
      // ISO date from FE: "YYYY-MM-DD"
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
    path: [],
  });

export type PatchMeInput = z.infer<typeof patchMeSchema>;
