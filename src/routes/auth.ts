import { Router } from 'express';
import { getMe } from '../controllers/auth.js'

const router = Router();

router.get('/me', async (req, res) => {
    const userAccount = await getMe('54321');

    res.status(200).send(userAccount);
});

/*
router.get('/auth/me', async (req, res) => {
    const user: UserAccount | null = await getMe(req.headers.authorization ?? "");
    if(user) {
        return res.status(200).json(user);
    } else {
        res.status(404).json({message: 'User not found'});
    }
});

router.post('/auth/register', async (req, res) => {
})

router.post('/auth/login', async (req, res) => {
})

router.post('/auth/logout', async (req, res) => {
})

router.post('/auth/refresh', async (req, res) => {
})

router.post('/auth/forgot-password', async (req, res) => {
})

router.post('/auth/reset-password', async (req, res) => {
})
*/

export default router;