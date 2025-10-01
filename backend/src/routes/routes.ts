import express from 'express';
import authRouter from './auth.routes';

const router = express.Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.use('/auth', authRouter);

export default router;
