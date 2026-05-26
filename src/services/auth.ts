import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import type { UserAccount, ValidationResponse, AuthTokens } from "../types.js"

const PG_UNIQUE_VIOLATION = '23505';

const secret = process.env.JWT_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
if (!secret)  throw new Error('JWT_SECRET is not set');
if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET is not set');

export class DuplicateEmailError extends Error {
    constructor() { super('An account for this email already exists.'); }
}

export class DatabaseError extends Error {
    constructor(cause?: unknown) {
        super('Database error');
        this.cause = cause;
    }
}

export async function createUserHandler(email: string, password: string, username: string): Promise<UserAccount> {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username',
            [email, passwordHash, username]
        );
        return result.rows[0] as UserAccount;
    } catch (error: any) {
        if (error.code === PG_UNIQUE_VIOLATION) throw new DuplicateEmailError();
        console.error(error);
        throw new DatabaseError(error);
    }
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
    try {
        const query = `SELECT id, email, username FROM users WHERE email = $1`;
        const dataset = await pool.query(query, [email]);
        if (dataset.rows.length === 0) {
            return null;
        }
        return dataset.rows[0] as UserAccount;
    } catch (error: any) {
        console.error(error);
        throw new DatabaseError(error);
    }
}

export async function verifyUserByEmail(email: string, password: string): Promise<UserAccount | false> {
    try {
        const query = `SELECT id, email, username, password_hash FROM users WHERE email = $1`;
        const dataset = await pool.query(query, [email]);
        if (!dataset || dataset.rows.length === 0 || !(await bcrypt.compare(password, dataset.rows[0].password_hash))) {
            return false;
        }
        return { id: dataset.rows[0].id, email: dataset.rows[0].email, username: dataset.rows[0].username };
    } catch (error: any) {
        console.error(error);
        throw new DatabaseError(error);
    }
}

export function generateTokens(user: UserAccount): AuthTokens {
    const payload = {userId: user.id, email: user.email, username: user.username};

    const accessToken = jwt.sign(payload, secret, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, refreshSecret, {expiresIn: '7d'});
    return {accessToken, refreshToken};
}


export async function getMeHandler(access_token: string): Promise<UserAccount | null> {
    return { id: 123456, username: 'dummy', email: 'dummy@example.com' };
}