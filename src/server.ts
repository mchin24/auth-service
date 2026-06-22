import express from 'express';
import authRouter from './routes/auth.js';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.get('/health', (req, res) => {
    return res.status(200).send('OK');
})
export default app;