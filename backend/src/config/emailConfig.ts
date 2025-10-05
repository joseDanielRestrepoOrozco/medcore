import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import {
  NODE_ENV,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
} from '../libs/config';

interface MailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const transporter: Transporter = nodemailer.createTransport({
  service: NODE_ENV === 'production' ? 'gmail' : undefined,

  host: SMTP_HOST,
  port: SMTP_PORT,

  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Función para enviar email de verificación
const sendVerificationEmail = async (
  email: string,
  fullname: string,
  verificationCode: string
): Promise<MailResult> => {
  const mailOptions: SendMailOptions = {
    from: SMTP_USER,
    to: email,
    subject: 'Verificación de Cuenta - Confirma tu email',
    html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">¡Bienvenido/a!</h1> 
      </div>
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Hola ${fullname}</h2>
        <p style="color: #666; line-height: 1.6;">
          Gracias por registrarte en nuestra plataforma. Para completar tu registro, necesitas verificar tu dirección de correo electrónico:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 3px;">
            ${verificationCode}
          </div>
        </div>
        <p style="color: #666; line-height: 1.6;">
          Introduce este código en la aplicación para activar tu cuenta.
          <br>
          <strong>Este código es válido solo por 15 minutos.</strong>
        </p>
      </div>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email enviado: ${info.messageId}`);
    console.log(`correo destino: ${mailOptions.to}`);
    console.log(SMTP_HOST, SMTP_PORT, SMTP_USER);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error enviando email:', error.message);
      return { success: false, error: error.message };
    }
    console.error('Error desconocido enviando email:', error);
    return { success: false, error: 'Error desconocido' };
  }
};

export default {
  transporter,
  generateVerificationCode,
  sendVerificationEmail,
};
