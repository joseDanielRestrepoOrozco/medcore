import express from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import patientRouter from './patient.routes';
// import patientBulkRouter from './patientBulk.routes';

const router = express.Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/patients', patientRouter);
// router.use('/patients', patientBulkRouter);

export default router;
