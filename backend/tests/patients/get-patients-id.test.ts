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
    firstName: 'Ana',
    lastName: 'García',
    email: `ana.garcia+${Date.now()}@mail.com`,
    phone: '+573001234568',
    gender: 'FEMALE',
    dateOfBirth: '1985-08-20',
  };
  const res = await api
    .post('/api/v1/patients')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(patientData)
    .expect(201);
  createdPatientId = res.body.patient.id;
});

describe('GET /api/v1/patients/:id', () => {
  test('Devuelve un paciente existente', async () => {
    const res = await api
      .get(`/api/v1/patients/${createdPatientId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body.patient).toBeTruthy();
    expect(res.body.patient.id).toBe(createdPatientId);
  });

  test('Devuelve 404 si el paciente no existe', async () => {
    const res = await api
      .get('/api/v1/patients/000000000000000000000000')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
    expect(res.body.error).toMatch(/no encontrado/i);
  });
});
