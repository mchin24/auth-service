import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import type { UserAccount, AuthTokens } from "../types.js"

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

export async function generateTokens(user: UserAccount): Promise<AuthTokens> {
    const payload = {userId: user.id, email: user.email, username: user.username};

    const accessToken = jwt.sign(payload, secret, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, refreshSecret, {expiresIn: '7d'});

    try {
        await pool.query(
            `INSERT INTO refresh_tokens ( token, user_id, expires_at ) VALUES ($1, $2, $3);`,
            [refreshToken, user.id,  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]);
    } catch (error: any) {
        console.error(error);
        throw new DatabaseError(error);
    }

    return {accessToken, refreshToken};
}

export async function validateRefreshToken(token: string): Promise<UserAccount | false> {
    try {
        jwt.verify(token, refreshSecret);
    } catch (error) {
        return false;
    }

    try {
        const dbResult = await pool.query(
            `SELECT rt.token, rt.user_id, rt.expires_at, u.email, u.username 
            FROM refresh_tokens rt JOIN
            users u ON rt.user_id = u.id
            WHERE rt.token = $1 and rt.expires_at > NOW()`,
            [token]);
        if(dbResult.rows.length === 0) return false;
        return {id: dbResult.rows[0].user_id, email: dbResult.rows[0].email, username: dbResult.rows[0].username};
    } catch (error: any) {
        console.error(error);
        throw new DatabaseError();
    }
}

export async function invalidateRefreshToken(token: string): Promise<void> {
    try {
        await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
    } catch (error: any) {
        console.error(error);
        throw new DatabaseError();
    }
}


export async function getMeHandler(access_token: string): Promise<UserAccount | null> {
    return { id: 123456, username: 'dummy', email: 'dummy@example.com' };
}