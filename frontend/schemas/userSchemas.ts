import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const registerSchema = z.object({
  name: z.string().regex(/^[A-Za-z\s]+$/, 'Only letters'),
  email: z.string().email('Invalid email'),
  password: z.string().regex(/^[A-Za-z0-9_@]{8,}$/, 'Min 8 chars, letters, numbers, _ or @'),
  role: z.enum(['admin', 'manager', 'receptionist', 'customer']).default('customer'),
  nidNumber: z.string().regex(/^\d{13}$|^\d{17}$/, 'NID 13 or 17 digits'),
});

export const updateUserSchema = registerSchema.partial();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
