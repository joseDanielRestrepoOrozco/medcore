import { describe, test, beforeEach, afterAll, expect } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { MailSlurp } from 'mailslurp-client';

const api = supertest(app);

const mailSlurp = new MailSlurp({
  apiKey: process.env.API_KEY_MAILSLURP as string,
});

describe('email service', () => {
  test('should send an email using MailSlurp', async () => {
    // Create a new inbox
    const inbox = await mailSlurp.inboxController.createInboxWithDefaults();
    console.log('Created inbox:', inbox.emailAddress);
    expect(inbox.emailAddress).toContain('@mailslurp');
  });
});

describe.only('Registration', async () => {
  const inbox = await mailSlurp.inboxController.createInboxWithDefaults();

  beforeEach(async () => {
    // Clear the users collection before each test
    await mongoose.connection.collection('users').deleteMany({});
  });
  
  
  test('User Registration - Successful Registration', async () => {
    const userData = {
      email: inbox.emailAddress,
      currentPassword: '123456',
      fullname: 'Test User',
    };

    const response = await api
    .post('/api/v1/auth/sign-up')
    .send(userData)
    .expect(201)
    .expect('Content-Type', /application\/json/);
    
    // Verify user was created with verification code for email sending
    expect(response.body.email).toBe(userData.email);
    expect(response.body.fullname).toBe(userData.fullname);
    expect(response.body.status).toBe('PENDING');
    expect(response.body.verificationCode).toBeDefined();
    expect(response.body.verificationCode).toMatch(/^\d{6}$/);
    expect(response.body.verificationCodeExpires).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mailSlurp.inboxController.deleteAllInboxes();
});