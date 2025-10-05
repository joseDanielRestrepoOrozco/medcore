import { z } from 'zod';

const currentPassword = z
  .string()
  .min(1)
  .max(6)
  .refine(val => /\d/.test(val), {
    message: 'Debe contener al menos un número',
  });

export const signupSchema = z.object({
  email: z.email(),
  currentPassword,
  fullname: z.string().min(1),
  role: z.enum(['MEDICO', 'ENFERMERA', 'PACIENTE', 'ADMINISTRADOR']).optional().default('ADMINISTRADOR'),
});

export const loginSchema = z.object({
  email: z.email(),
  currentPassword,
});

export const verifyEmailSchema = z.object({
  email: z.email(),
  verificationCode: z.string().min(1).max(6),
});

export const resendVerificationCodeSchema = z.object({
  email: z.email(),
});
