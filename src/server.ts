import express from 'express';
import type {UserAccount} from './types.js';
import {getMe} from './services/auth.js';

const app = express();

app.get('/auth/me', async (req, res) => {
    const user: UserAccount | null = await getMe(req.headers.authorization ?? "");
    if(user) {
        return res.status(200).json(user);
    } else {
        res.status(404).json({message: 'User not found'});
    }
});

app.post('/auth/register', async (req, res) => {
})

app.post('/auth/login', async (req, res) => {
})

app.post('/auth/logout', async (req, res) => {
})

app.post('/auth/refresh', async (req, res) => {
})

app.post('/auth/forgot-password', async (req, res) => {
})

app.post('/auth/reset-password', async (req, res) => {
})

export default app;