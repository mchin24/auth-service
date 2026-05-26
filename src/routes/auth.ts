import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { register, getMe} from '../controllers/auth.js';

const router = Router();

router.get('/me', async (req, res) => {
    const userAccount = await getMe('54321');
    /*
    if(user) {
        return res.status(200).json(user);
    } else {
        res.status(404).json({message: 'User not found'});
    }
     */

    res.status(200).send(userAccount);
});

router.post('/register', register)

router.post('/auth/login', async (req, res) => {
    res.status(501).send();
})

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