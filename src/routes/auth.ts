import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { register, login, logout, getMe} from '../controllers/auth.js';

const router = Router();

router.get('/me', async (req, res) => {
    const userAccount = await getMe('54321');

    res.status(200).send(userAccount);
});

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh', async (req, res) => {
    res.status(501).send();
})

router.post('/forgot-password', async (req, res) => {
    res.status(501).send();
})

router.post('/reset-password', async (req, res) => {
    res.status(501).send();
})

export default router;