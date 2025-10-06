import { api } from '../auth/setup';

/**
 * Crea un usuario administrador y retorna su token JWT listo para usar en tests.
 */
export async function getAdminToken() {
  const adminData = {
    email: `admin+${Date.now()}@mail.com`,
    currentPassword: 'admin123',
    fullname: 'Admin Test',
  };
  // Registro
  await api.post('/api/v1/auth/sign-up').send(adminData).expect(201);
  // Obtener el email enviado
  const mailRes = await fetch('http://localhost:8025/api/v2/messages?limit=1');
  const mailJson = await mailRes.json();
  const html = mailJson?.items?.[0]?.Content?.Body || '';
  const match = html.match(/<!--\s*VERIFICATION_CODE:(\d{6})\s*-->/);
  const verificationCode = match ? match[1] : null;
  // Verificar email
  await api
    .post('/api/v1/auth/verify-email')
    .send({
      email: adminData.email,
      verificationCode,
    })
    .expect(200);
  // Login
  const loginRes = await api
    .post('/api/v1/auth/log-in')
    .send({
      email: adminData.email,
      currentPassword: adminData.currentPassword,
    })
    .expect(200);
  return loginRes.body.token;
}
