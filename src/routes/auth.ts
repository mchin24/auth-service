import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {register, login, logout, getMe, refreshToken} from '../controllers/auth.js';

const router = Router();

router.get('/me', requireAuth, getMe);

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

router.post('/forgot-password', async (req, res) => {
    res.status(501).send();
});

router.post('/reset-password', async (req, res) => {
    res.status(501).send();
});

export default router;