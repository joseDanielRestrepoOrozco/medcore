import express from 'express';
import authRouter from './auth.routes';
import patientRouter from './patient.routes';

const router = express.Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.use('/auth', authRouter);
router.use('/patients', patientRouter);

export default router;
