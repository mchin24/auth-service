import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { register, login, logout, getMe, refreshToken, forgotPassword, resetPassword } from '../controllers/auth.js';

const router = Router();

router.get('/me', requireAuth, getMe);

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

export default router;