import { z } from 'zod';
import type { Request, Response } from 'express';
import type {AuthTokens, UserAccount} from "../types.js";
import {createUserHandler, generateTokens, getMeHandler, getUserByEmail, verifyPassword} from "../services/auth.js";

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

export async function register(req: Request, res: Response): Promise<void> {
    if(!req.body) {
        res.contentType('application/json');
        res.status(400).send({"message": "no message body"});
    }

    try {
        const email= req.body.email;
        const password=req.body.password;
        const userAccount = await createUserHandler(email, password, email);
        const tokens: AuthTokens = generateTokens(userAccount);

        res.status(201).send({user: userAccount, tokens});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    if( !req.body ) {
        res.status(400).send({"message": "missing required fields"});
    }

    if(!req.body.email || !req.body.email.length) {
        res.status(400).send({"message": "email is required"});
    }

    if (!req.body.password || !req.body.password.length) {
        res.status(400).send({"message": "password is required"});
    }

    try {
        const verifyResult = await verifyPassword(req.body.email, req.body.password);
        if(!verifyResult) {
            res.status(401).send({"message": "invalid credentials"});
            return
        }

        const userAccount = await getUserByEmail(req.body.email);
        if (!userAccount) {
            res.status(401).send({"message": "invalid credentials"});
            return;
        }

        const tokens: AuthTokens = generateTokens(userAccount);

        res.status(200).send({user: userAccount, tokens});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}