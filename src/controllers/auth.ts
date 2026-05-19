import jwt from 'jsonwebtoken';
import { z } from 'zod';
import pg from 'pg'
import { Client } from 'pg'
import type { UserAccount, ValidationResponse, AuthTokens } from "../types.js"

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

export async function createUser(email: string, password: string): Promise<UserAccount> {
    return {id: 0, email: '', username: ''};
}

export function generateTokens(user: UserAccount): AuthTokens {
    const payload = {userId: user.id, email: user.email, username: user.username};

    const secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!secret) { throw new Error('JWT_SECRET is not set'); }
    if (!refreshSecret) { throw new Error('JWT_REFRESH_SECRET is not set'); }

    const accessToken = jwt.sign(payload, secret, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, refreshSecret, {expiresIn: '7d'});
    return {accessToken, refreshToken};
}


export function getMe(access_token: string): UserAccount | null {
    return {id: 123456, email: 'dummy@example.com', username: 'dummy' };
}