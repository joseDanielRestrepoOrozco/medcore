import { describe, test, beforeEach, afterAll, expect } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { MAILHOG_URL, TEST_EMAIL } from '../src/libs/config';
import getLastEmail from './utils';

const prisma = new PrismaClient();
const api = supertest(app);

beforeEach(async () => {
  // Clear the users collection before each test
  await prisma.users.deleteMany({});
  // Limpiar mensajes de MailHog
  await fetch(`${MAILHOG_URL}/messages`, { method: 'DELETE' });
});

describe('Email', () => {
  test('User Registration - Successful Registration and Email Sent', async () => {
    const userData = {
      email: TEST_EMAIL,
      currentPassword: '123456',
      fullname: 'Test User',
    };

    const response = await api
      .post('/api/v1/auth/sign-up')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // Verificar usuario creado
    expect(response.body.email).toBe(userData.email);
    expect(response.body.fullname).toBe(userData.fullname);
    expect(response.body.status).toBe('PENDING');
    expect(response.body.message).toBe(
      'Usuario creado. Código enviado al correo.'
    );

    const email = await getLastEmail();
    expect(email).toBeTruthy();

    const verificationCode = email.Content.Body.match(/\d{6}/);
    expect(verificationCode).toBeTruthy();
  });
});

describe('Sign up', async () => {
  // caso exitoso
  test('should register a user successfully', async () => {
    const userData = {
      email: TEST_EMAIL,
      currentPassword: '123456',
      fullname: 'Test User',
    };

    const response = await api.post('/api/v1/auth/sign-up').send(userData);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.fullname).toBe(userData.fullname);
    expect(response.body.status).toBe('PENDING');
    expect(response.body.message).toBe(
      'Usuario creado. Código enviado al correo.'
    );

    const email = await getLastEmail();
    expect(email).toBeTruthy();

    const verificationCode = email.Content.Body.match(/\d{6}/);
    expect(verificationCode).toBeTruthy();
  });

  // casos de matriz de errores

  describe('Email validation errors', () => {
    test('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        currentPassword: '123456',
        fullname: 'Test User',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for empty email', async () => {
      const userData = {
        email: '',
        currentPassword: '123456',
        fullname: 'Test User',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing email field', async () => {
      const userData = {
        currentPassword: '123456',
        fullname: 'Test User',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('Password validation errors', () => {
    test('should return 400 for password without numbers', async () => {
      const userData = {
        email: TEST_EMAIL,
        currentPassword: 'abcdef',
        fullname: 'Test User',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for password too short', async () => {
      const userData = {
        email: TEST_EMAIL,
        currentPassword: '',
        fullname: 'Test User',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for password too long', async () => {
      const userData = {
        email: TEST_EMAIL,
        currentPassword: '1234567',
        fullname: 'Test User',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing password field', async () => {
      const userData = {
        email: TEST_EMAIL,
        fullname: 'Test User',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('Fullname validation errors', () => {
    test('should return 400 for empty fullname', async () => {
      const userData = {
        email: TEST_EMAIL,
        currentPassword: '123456',
        fullname: '',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing fullname field', async () => {
      const userData = {
        email: TEST_EMAIL,
        currentPassword: '123456',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('Role validation errors', () => {
    test('should return 400 for invalid role', async () => {
      const userData = {
        email: TEST_EMAIL,
        currentPassword: '123456',
        fullname: 'Test User',
        role: 'INVALID_ROLE',
      };

      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('General validation errors', () => {
    test('should return 400 for completely empty body', async () => {
      const response = await api
        .post('/api/v1/auth/sign-up')
        .send({})
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for malformed JSON', async () => {
      await api
        .post('/api/v1/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    test('should return 400 for duplicate email registration', async () => {
      const userData = {
        email: TEST_EMAIL,
        currentPassword: '123456',
        fullname: 'Test User',
      };

      // Primer registro - debe ser exitoso
      await api.post('/api/v1/auth/sign-up').send(userData).expect(201);

      // Segundo registro con el mismo email - debe fallar
      const response = await api
        .post('/api/v1/auth/sign-up')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });
  });
});

describe('Email Verification', () => {
  beforeEach(async () => {
    // Crear un usuario para las pruebas de verificación
    await api.post('/api/v1/auth/sign-up').send({
      email: TEST_EMAIL,
      currentPassword: '123456',
      fullname: 'Test User',
    });
  });

  test('should verify email with correct code', async () => {
    // Obtener el código del email
    const email = await getLastEmail();
    const verificationCode = email.Content.Body.match(/\d{6}/)?.[0];

    const response = await api
      .post('/api/v1/auth/verify-email')
      .send({
        email: TEST_EMAIL,
        verificationCode,
      })
      .expect(200);

    expect(response.body.message).toBeTruthy();
  });

  describe('Email verification validation errors', () => {
    test('should return 400 for invalid email format', async () => {
      const response = await api
        .post('/api/v1/auth/verify-email')
        .send({
          email: 'invalid-email',
          verificationCode: '123456',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for empty verification code', async () => {
      const response = await api
        .post('/api/v1/auth/verify-email')
        .send({
          email: TEST_EMAIL,
          verificationCode: '',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for verification code too long', async () => {
      const response = await api
        .post('/api/v1/auth/verify-email')
        .send({
          email: TEST_EMAIL,
          verificationCode: '1234567',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing email field', async () => {
      const response = await api
        .post('/api/v1/auth/verify-email')
        .send({
          verificationCode: '123456',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing verification code field', async () => {
      const response = await api
        .post('/api/v1/auth/verify-email')
        .send({
          email: TEST_EMAIL,
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for incorrect verification code', async () => {
      const response = await api
        .post('/api/v1/auth/verify-email')
        .send({
          email: TEST_EMAIL,
          verificationCode: '000000',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });
  });
});

describe('Resend Verification Code', () => {
  beforeEach(async () => {
    // Crear un usuario para las pruebas de reenvío
    await api.post('/api/v1/auth/sign-up').send({
      email: TEST_EMAIL,
      currentPassword: '123456',
      fullname: 'Test User',
    });
  });

  test('should resend verification code for existing unverified user', async () => {
    const response = await api
      .post('/api/v1/auth/resend-verification-code')
      .send({
        email: TEST_EMAIL,
      })
      .expect(200);

    expect(response.body.message).toBeTruthy();

    // Verificar que se envió un nuevo email
    const email = await getLastEmail();
    expect(email).toBeTruthy();
    const verificationCode = email.Content.Body.match(/\d{6}/);
    expect(verificationCode).toBeTruthy();
  });

  describe('Resend verification code validation errors', () => {
    test('should return 400 for invalid email format', async () => {
      const response = await api
        .post('/api/v1/auth/resend-verification-code')
        .send({
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing email field', async () => {
      const response = await api
        .post('/api/v1/auth/resend-verification-code')
        .send({})
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for empty email', async () => {
      const response = await api
        .post('/api/v1/auth/resend-verification-code')
        .send({
          email: '',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for non-existent email', async () => {
      const response = await api
        .post('/api/v1/auth/resend-verification-code')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(404);

      expect(response.body.error).toBeTruthy();
    });
  });
});

describe('Login', () => {
  beforeEach(async () => {
    // Crear y verificar un usuario para las pruebas de login
    await api.post('/api/v1/auth/sign-up').send({
      email: TEST_EMAIL,
      currentPassword: '123456',
      fullname: 'Test User',
    });

    // Obtener código y verificar usuario
    const email = await getLastEmail();
    const verificationCode = email.Content.Body.match(/\d{6}/)?.[0];

    await api.post('/api/v1/auth/verify-email').send({
      email: TEST_EMAIL,
      verificationCode,
    });
  });

  test('should login with correct credentials', async () => {
    const response = await api.post('/api/v1/auth/log-in').send({
      email: TEST_EMAIL,
      currentPassword: '123456',
    });

    expect(response.body.token).toBeTruthy();
    expect(response.body.user).toBeTruthy();
  });

  describe('Login validation errors', () => {
    test('should return 400 for invalid email format', async () => {
      const response = await api
        .post('/api/v1/auth/log-in')
        .send({
          email: 'invalid-email',
          currentPassword: '123456',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for password without numbers', async () => {
      const response = await api
        .post('/api/v1/auth/log-in')
        .send({
          email: TEST_EMAIL,
          currentPassword: 'abcdef',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing email field', async () => {
      const response = await api
        .post('/api/v1/auth/log-in')
        .send({
          currentPassword: '123456',
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 400 for missing password field', async () => {
      const response = await api
        .post('/api/v1/auth/log-in')
        .send({
          email: TEST_EMAIL,
        })
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 401 for incorrect password', async () => {
      const response = await api
        .post('/api/v1/auth/log-in')
        .send({
          email: TEST_EMAIL,
          currentPassword: '654321',
        })
        .expect(401);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 401 for non-existent email', async () => {
      const response = await api
        .post('/api/v1/auth/log-in')
        .send({
          email: 'nonexistent@example.com',
          currentPassword: '123456',
        })
        .expect(401);

      expect(response.body.error).toBeTruthy();
    });

    test('should return 401 for unverified user', async () => {
      // Crear un usuario sin verificar
      await api.post('/api/v1/auth/sign-up').send({
        email: 'unverified@example.com',
        currentPassword: '123456',
        fullname: 'Unverified User',
      });

      const response = await api
        .post('/api/v1/auth/log-in')
        .send({
          email: 'unverified@example.com',
          currentPassword: '123456',
        })
        .expect(401);

      expect(response.body.error).toBeTruthy();
    });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
