import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import type { UserAccount } from '../types.js';

declare global {
    namespace Express {
        interface Request {
            user?: UserAccount;
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if(!header?.startsWith('Bearer ')) {
        res.status(401).send('Invalid or missing token.');
        return;
    }

    const token = header.slice(7);
    const secret = process.env.JWT_SECRET;
    if(!secret) throw new Error('JWT_SECRET is not set.');

    try {
        const payload = jwt.verify(token, secret) as UserAccount;
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).send('Invalid or missing token.');
    }
}