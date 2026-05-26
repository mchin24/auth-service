import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { register, login, getMe} from '../controllers/auth.js';

const router = Router();

router.get('/me', async (req, res) => {
    const userAccount = await getMe('54321');

    res.status(200).send(userAccount);
});

router.post('/register', register)

router.post('/login', login)

router.post('/auth/logout', async (req, res) => {
    res.status(501).send();
})

router.post('/auth/refresh', async (req, res) => {
    res.status(501).send();
})

router.post('/auth/forgot-password', async (req, res) => {
    res.status(501).send();
})

router.post('/auth/reset-password', async (req, res) => {
    res.status(501).send();
})

export default router;