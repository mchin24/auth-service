import { z } from 'zod';
import type { Request, Response } from 'express';
import type { AuthTokens, UserAccount, ValidationResponse } from "../types.js";
import {
    createUserHandler,
    DuplicateEmailError,
    generateTokens,
    getMeHandler, invalidateRefreshToken, validateRefreshToken,
    verifyUserByEmail
} from "../services/auth.js";

export function isValidEmail(email: string): ValidationResponse {
    const result = z.email().safeParse(email);
    if(!result.success) {
        return {valid: false, error: result.error.issues.map(issue => issue.message) };
    } else {
        return {valid: true, error: []}
    }
}

export function isValidPassword(password: string): ValidationResponse {
    const passwordSchema = z.string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*]/);

    const result = passwordSchema.safeParse(password);
    if(!result.success) {
        return {valid: false, error: result.error.issues.map(issue => issue.message) };
    } else {
        return {valid: true, error: []}
    }
}

export async function getMe(access_token: string): Promise<UserAccount | null> {
    const userAccount = await getMeHandler(access_token);
    if(!userAccount) {
        return null;
    }
    return userAccount;
}

export async function register(req: Request, res: Response): Promise<void> {
    res.contentType('application/json');
    if(!req.body) {
        res.status(400).send({"message": ["no message body"]});
        return;
    }

    if(!req.body.email || !req.body.email.length) {
        res.status(400).send({"message": ["email is required"]});
        return;
    }

    const validEmail = isValidEmail(req.body.email);
    if(!validEmail.valid) {
        res.status(400).send({"message": validEmail.error});
        return;
    }

    if(!req.body.password || !req.body.password.length) {
        res.status(400).send({"message": ["password is required"]});
        return;
    }

    const validPassword = isValidPassword(req.body.password);
    if(!validPassword.valid) {
        res.status(400).send({"message": validPassword.error});
        return;
    }

    try {
        const email= req.body.email;
        const password=req.body.password;
        const userAccount = await createUserHandler(email, password, email);
        const tokens: AuthTokens = await generateTokens(userAccount);

        res.status(201).send({user: userAccount, tokens});
    } catch (error) {
        if(error instanceof DuplicateEmailError) {
            res.status(409).send({"message": ["user is already registered"]});
            return;
        }

        console.error(error);
        res.status(500).send();
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    res.contentType('application/json');
    if( !req.body ) {
        res.status(400).send({"message": ["missing required fields"]});
        return;
    }

    if(!req.body.email || !req.body.email.length) {
        res.status(400).send({"message": ["email is required"]});
        return;
    }

    if (!req.body.password || !req.body.password.length) {
        res.status(400).send({"message": ["password is required"]});
        return;
    }

    try {
        const userAccount = await verifyUserByEmail(req.body.email, req.body.password);

        if (!userAccount) {
            res.status(401).send({"message": ["invalid credentials"]});
            return;
        }

        const tokens: AuthTokens = await generateTokens(userAccount);

        res.status(200).send({user: userAccount, tokens});
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
}

export async function logout(req: Request, res: Response): Promise<void> {
    res.contentType('application/json');

    if(!req.body || !req.body.refreshToken) {
        res.status(400).send({"message": ["missing required field: refreshToken"]});
        return;
    }

    try {
        const user: false | UserAccount = await validateRefreshToken(req.body.refreshToken);
        if(!(user)) {
            res.status(401).send({"message": ["invalid credentials"]});
            return;
        }
        await invalidateRefreshToken(req.body.refreshToken);
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(500).send();
    }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
    res.contentType('application/json');
    const refreshSchema = z.object({
        refreshToken: z.string().min(1, 'refreshToken is required')
    });
    const result = refreshSchema.safeParse(req.body);
    if(!result.success) {
        res.status(400).send({"message": ['missing required field: refreshToken'] });
        return;
    }

    const user: false | UserAccount = await validateRefreshToken(req.body.refreshToken);
    if(!(user)) {
        res.status(401).send({"message": ["invalid credentials"]});
        return;
    }

    const tokens = await generateTokens(user);

    res.status(200).send({accessToken: tokens.accessToken});
}