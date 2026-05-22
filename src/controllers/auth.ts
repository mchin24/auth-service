import { z } from 'zod';
import type {UserAccount} from "../types.js";
import { getMeHandler } from "../services/auth.js";

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

export async function getMe(access_token: string): Promise<UserAccount | null> {
    const userAccount = await getMeHandler(access_token);
    if(!userAccount) {
        return null;
    }
    return userAccount;
}