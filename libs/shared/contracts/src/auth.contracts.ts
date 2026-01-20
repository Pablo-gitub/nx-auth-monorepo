import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().max(255),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(8),
    birthDate: z.string().min(1), // ISO date string dal FE
    avatarUrl: z.string().url().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// utile per le risposte BE (mai includere passwordHash)
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
