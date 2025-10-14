import { z } from 'zod';

const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ' -]{1,60}$/;
const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

export const patientCreateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Nombre requerido')
    .regex(nameRegex, 'Nombre inválido'),
  lastName: z
    .string()
    .min(1, 'Apellido requerido')
    .regex(nameRegex, 'Apellido inválido'),
  email: z.email('Email inválido'),
  phone: z.string().regex(phoneRegex, 'Teléfono inválido').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.iso.date({
    message: 'Fecha de nacimiento inválida',
  }),
});

export const patientUpdateSchema = z.object({
  firstName: z.string().min(1).regex(nameRegex, 'Nombre inválido').optional(),
  lastName: z.string().min(1).regex(nameRegex, 'Apellido inválido').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().regex(phoneRegex, 'Teléfono inválido').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine(s => !s || !Number.isNaN(Date.parse(s)), {
      message: 'Fecha de nacimiento inválida',
    }),
});

export const validateAge = z.number().min(0).max(100);

export const patientStateSchema = z.object({
  state: z.enum(['ACTIVO', 'INACTIVO']),
});

export type PatientCreate = z.infer<typeof patientCreateSchema>;
export type PatientUpdate = z.infer<typeof patientUpdateSchema> & {
  dateOfBirth?: Date | string;
  age?: number;
};
