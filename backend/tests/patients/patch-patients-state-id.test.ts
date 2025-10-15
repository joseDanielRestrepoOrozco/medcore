import { describe, test, expect, beforeAll } from 'vitest';
import { setupAuthTests, api } from '../auth/setup';
import { getAdminToken } from './getAdminToken';

setupAuthTests();

let adminToken: string;
let createdPatientId: string;

beforeAll(async () => {
  adminToken = await getAdminToken();
  // Crear paciente para pruebas de patch
  const patientData = {
    fullname: 'Lucía Martínez',
    email: `lucia.martinez+${Date.now()}@mail.com`,
    phone: '573001234570',
    current_password: 'patient123',
    gender: 'FEMALE',
    date_of_birth: '1995-03-15',
  };
  const res = await api
    .post('/api/v1/patients')
    .set('Authorization', `${adminToken}`)
    .send(patientData)
    .expect(201);
  createdPatientId = res.body.patient.id;
});

describe('PATCH /api/v1/patients/state/:id', () => {
  test('Actualiza el estado de un paciente', async () => {
    const res = await api
      .patch(`/api/v1/patients/state/${createdPatientId}`)
      .set('Authorization', `${adminToken}`)
      .send({ state: 'INACTIVO' })
      .expect(200);
    expect(res.body.patient.state).toBe('INACTIVO');
  });
});
