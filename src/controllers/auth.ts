import { z } from 'zod';
import type { Request, Response } from 'express';
import type {UserAccount} from "../types.js";
import {createUserHandler, getMeHandler} from "../services/auth.js";

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

export async function createUserAccount(req: Request, res: Response): Promise<void> {
    if(!req.body) {
        res.contentType('application/json');
        res.status(400).send({"message": "no message body"});
    }

    try {
        const email= req.body.email;
        const password=req.body.password;
        const userAccount = await createUserHandler(email, password, email);

        res.status(200).send({user: userAccount});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}