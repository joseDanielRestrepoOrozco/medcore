import { describe, test, expect, beforeAll } from 'vitest';
import { setupAuthTests, api } from '../auth/setup';
import { getAdminToken } from './getAdminToken';

setupAuthTests();

let adminToken: string;
let createdPatientId: string;

beforeAll(async () => {
  adminToken = await getAdminToken();
  // Crear paciente para pruebas de update
  const patientData = {
    fullname: 'Carlos Ramírez',
    email: `carlos.ramirez+${Date.now()}@mail.com`,
    phone: '573001234569',
    gender: 'MALE',
    current_password: 'patient123',
    date_of_birth: '1978-12-01',
  };
  const res = await api
    .post('/api/v1/patients')
    .set('Authorization', `${adminToken}`)
    .send(patientData)
    .expect(201);
  createdPatientId = res.body.patient.id;
});

describe('PUT /api/v1/patients/:id', () => {
  test('Actualiza datos de un paciente', async () => {
    const update = { phone: '+573009876543', gender: 'OTHER' };
    const res = await api
      .put(`/api/v1/patients/${createdPatientId}`)
      .set('Authorization', `${adminToken}`)
      .send(update)
      .expect(200);
    expect(res.body.patient.phone).toBe(update.phone);
    expect(res.body.patient.gender).toBe(update.gender);
  });
});
