import jwt from 'jsonwebtoken';
import pg from 'pg'
import { Client } from 'pg'
import type { UserAccount, ValidationResponse, AuthTokens } from "../types.js"

export async function isValidEmail(email: string): Promise<boolean> {
    return false;
}

export async function isValidPassword(password: string): Promise<boolean> {
    return false;
}

export async function createUser(email: string, password: string): Promise<UserAccount> {
    return {id: 0, email: '', username: ''};
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {

}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {

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

export async function validateRefreshToken(token: string): Promise<boolean> {

}

export function getMe(access_token: string): UserAccount | null {
    return {id: 123456, email: 'dummy@example.com', username: 'dummy' };
}