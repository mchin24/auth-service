import pg from 'pg'
import { Client } from 'pg'
import type { UserAccount } from "../types.js"

export function isValidEmail(email: string): boolean {
    return false;
}

export function isValidPassword(password: string): boolean {
    return false;
}

export function getMe(access_token: string): UserAccount | null {
    return null;
}