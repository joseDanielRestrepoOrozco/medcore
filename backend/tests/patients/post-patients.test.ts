import { describe, test, expect, beforeAll } from 'vitest';
import { setupAuthTests, api } from '../auth/setup';
import { getAdminToken } from './getAdminToken';

setupAuthTests();

let adminToken: string;

beforeAll(async () => {
  adminToken = await getAdminToken();
});

describe('POST /api/v1/patients', () => {
  test('Crea un paciente correctamente', async () => {
    const patientData = {
      fullname: 'Juan Pérez',
      email: `juan.perez+${Date.now()}@mail.com`,
      phone: '573001234567',
      gender: 'MALE',
      current_password: 'patient123',
      date_of_birth: '1990-05-10',
    };
    const res = await api
      .post('/api/v1/patients')
      .set('Authorization', `${adminToken}`)
      .send(patientData)
      .expect(201);
    expect(res.body.patient).toBeTruthy();
    expect(res.body.patient.fullname).toBe(patientData.fullname);
    expect(res.body.patient.email).toBe(patientData.email);
    expect(res.body.patient.phone).toBe(patientData.phone);
    expect(res.body.patient.gender).toBe(patientData.gender);
    expect(res.body.patient.date_of_birth).toBe(patientData.date_of_birth);
  });
});
