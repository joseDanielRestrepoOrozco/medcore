import { z } from 'zod';

export const patientCreateSchema = z.object({
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  email: z.email().optional(),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: 'Fecha de nacimiento inválida',
  }),
});

export const patientUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().optional().refine((s) => !s || !Number.isNaN(Date.parse(s)), {
    message: 'Fecha de nacimiento inválida',
  }),
});

export const patientStateSchema = z.object({
  state: z.enum(['ACTIVO', 'INACTIVO']),
});

export type PatientCreate = z.infer<typeof patientCreateSchema>;
export type PatientUpdate = z.infer<typeof patientUpdateSchema> & { dateOfBirth?: Date | string; age?: number };
