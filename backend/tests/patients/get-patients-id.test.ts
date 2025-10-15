import { describe, test, expect, beforeAll } from 'vitest';
import { setupAuthTests, api } from '../auth/setup';
import { getAdminToken } from './getAdminToken';

setupAuthTests();

let adminToken: string;
let createdPatientId: string;

beforeAll(async () => {
  adminToken = await getAdminToken();
  // Crear paciente para pruebas de GET
  const patientData = {
    fullname: 'Ana Garcia',
    email: `ana.garcia+${Date.now()}@mail.com`,
    date_of_birth: '1985-08-20',
    current_password: 'patient123',
    phone: '573001234568',
    gender: 'FEMALE',
  };
  const res = await api
    .post('/api/v1/patients')
    .auth(adminToken, { type: 'bearer' })
    .send(patientData)
    .expect(201);
  createdPatientId = res.body.patient.id;
});

describe.only('GET /api/v1/patients/:id', () => {
  test('Devuelve un paciente existente', async () => {
    const res = await api
      .get(`/api/v1/patients/${createdPatientId}`)
      .auth(adminToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.patient).toBeTruthy();
    expect(res.body.patient.id).toBe(createdPatientId);
  });

  test('Devuelve 404 si el paciente no existe', async () => {
    const res = await api
      .get('/api/v1/patients/000000000000000000000000')
      .set('Authorization', `${adminToken}`)
      .expect(404);
    expect(res.body.error).toMatch(/no encontrado/i);
  });
});
