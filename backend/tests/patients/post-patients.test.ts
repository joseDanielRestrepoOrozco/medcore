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
      firstName: 'Juan',
      lastName: 'Pérez',
      email: `juan.perez+${Date.now()}@mail.com`,
      phone: '+573001234567',
      gender: 'MALE',
      dateOfBirth: '1990-05-10',
    };
    const res = await api
      .post('/api/v1/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(patientData)
      .expect(201);
    expect(res.body.patient).toBeTruthy();
    expect(res.body.patient.firstName).toBe(patientData.firstName);
    expect(res.body.patient.lastName).toBe(patientData.lastName);
  });
});
