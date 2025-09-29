import express from 'express';
import authController from '../controllers/auth.controller';
const router = express.Router();

router.post('/sign-up', authController.signup);
router.post('/log-in', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification-code', authController.resendVerificationCode);

export default router;
