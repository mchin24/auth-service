import pg from 'pg'
import { Client } from 'pg'
import type { UserAccount } from "../types.js"

export function getMe(access_token: string): UserAccount | null {
    return null;
}