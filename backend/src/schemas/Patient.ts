import { z } from 'zod';

const statePatient = z.enum(['ACTIVE', 'INACTIVE']);

export const PatientSchema = z.object({
  userId: z.string(),
  documentNumber: z.string(),
  gender: z.string(),
  address: z.string().optional(),
  state: statePatient.default('ACTIVE'),
});

export const patientStateSchema = z.object({
  state: z.enum(['ACTIVE', 'INACTIVE']),
});

export const UpdatePatientSchema = PatientSchema.partial();
