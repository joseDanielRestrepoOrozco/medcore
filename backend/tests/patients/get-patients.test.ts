import { describe, test, expect, beforeAll } from 'vitest';
import { setupAuthTests, api } from '../auth/setup';
import { getAdminToken } from './getAdminToken';

setupAuthTests();

let adminToken: string;

beforeAll(async () => {
  adminToken = await getAdminToken();
});

describe('GET /api/v1/patients', () => {
  test('Lista pacientes con paginación', async () => {
    const res = await api
      .get('/api/v1/patients')
      .set('Authorization', `${adminToken}`)
      .expect(200);
    expect(Array.isArray(res.body.patients)).toBe(true);
    expect(res.body.pagination).toBeTruthy();
  });
});
