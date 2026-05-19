import { z } from 'zod';

export function isValidEmail(email: string): boolean {
    return z.email().safeParse(email).success;
}

export function isValidPassword(password: string): boolean {
    const passwordSchema = z.string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*]/);

    return passwordSchema.safeParse(password).success;
}