import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailConfig from '../config/emailConfig';
import { NextFunction, Request, Response } from 'express';
import { signupSchema, loginSchema, verifyEmailSchema, resendVerificationCodeSchema } from '../schemas/Auth';
import { SECRET } from '../libs/config';

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = signupSchema.parse(req.body);
    console.log('[signup] request', { email: newUser.email, fullname: newUser.fullname });

    // Evitar leer campos con tipos inválidos en documentos antiguos
    const userExist = await prisma.users.findUnique({
      where: { email: newUser.email },
      select: { id: true },
    });

    if (userExist) {
      console.log('[signup] user already exists:', newUser.email);
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const verificationCode = emailConfig.generateVerificationCode();

    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 15
    );

    const createUser = await prisma.users.create({
      data: {
        email: newUser.email,
        currentPassword: await bcrypt.hash(newUser.currentPassword, 10),
        fullname: newUser.fullname,
        verificationCode,
        verificationCodeExpires,
      },
    });
    console.log('[signup] user created', { id: createUser.id, email: createUser.email });

    console.log('[signup] sending verification email...');
    const emailResult = await emailConfig.sendVerificationEmail(
      newUser.email,
      newUser.fullname,
      verificationCode
    );

    if (!emailResult.success) {
      console.error('[signup] email sending failed:', emailResult.error);
      await prisma.users.delete({
        where: { id: createUser.id },
      });
      res.status(500).json({ error: 'Error sending verification email' });
      return;
    }

    // Sanitize response (no password or codes)
    res.status(201).json({
      id: createUser.id,
      email: createUser.email,
      fullname: createUser.fullname,
      status: createUser.status,
      message: 'Usuario creado. Código enviado al correo.'
    });
  } catch (error: unknown) {
    console.error('[signup] unhandled error', error);
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validar datos con Zod
    const loginData = loginSchema.parse(req.body);

    // Buscar usuario por email
    const user = await prisma.users.findUnique({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        fullname: true,
        status: true,
        currentPassword: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar si el usuario está verificado
    if (user.status !== 'VERIFIED') {
      res.status(401).json({ error: 'Email no verificado. Revisa tu correo.' });
      return;
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(
      loginData.currentPassword,
      user.currentPassword
    );

    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar token JWT
    if (!SECRET) {
      res.status(500).json({ error: 'Error de configuración del servidor' });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        fullname: user.fullname,
      },
      SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        status: user.status,
      },
      token,
    });
  } catch (error: unknown) {
    next(error);
  }
};

const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validar datos con Zod
    const verifyData = verifyEmailSchema.parse(req.body);

    // Buscar usuario por email
    const user = await prisma.users.findUnique({
      where: { email: verifyData.email },
      select: {
        id: true,
        email: true,
        fullname: true,
        status: true,
        verificationCode: true,
        verificationCodeExpires: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si ya está verificado
    if (user.status === 'VERIFIED') {
      res.status(400).json({ error: 'Usuario ya verificado' });
      return;
    }

    // Verificar código
    if (user.verificationCode !== verifyData.verificationCode) {
      res.status(400).json({ error: 'Código de verificación inválido' });
      return;
    }

    // Verificar si el código no ha expirado
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      res.status(400).json({ error: 'Código de verificación expirado' });
      return;
    }

    // Actualizar usuario a verificado
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        status: 'VERIFIED',
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    res.status(200).json({
      message: 'Email verificado exitosamente',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullname: updatedUser.fullname,
        status: updatedUser.status,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};

const resendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validar datos con Zod
    const resendData = resendVerificationCodeSchema.parse(req.body);

    // Buscar usuario por email
    const user = await prisma.users.findUnique({
      where: { email: resendData.email },
      select: {
        id: true,
        email: true,
        fullname: true,
        status: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si ya está verificado
    if (user.status === 'VERIFIED') {
      res.status(400).json({ error: 'Usuario ya verificado' });
      return;
    }

    // Generar nuevo código de verificación
    const verificationCode = emailConfig.generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 15
    );

    // Actualizar usuario con nuevo código
    await prisma.users.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpires,
      },
    });

    // Enviar email con nuevo código
    const emailResult = await emailConfig.sendVerificationEmail(
      user.email,
      user.fullname,
      verificationCode
    );

    if (!emailResult.success) {
      res.status(500).json({ error: 'Error enviando código de verificación' });
      return;
    }

    res.status(200).json({
      message: 'Código de verificación reenviado exitosamente',
    });
  } catch (error: unknown) {
    next(error);
  }
};

export default { signup, login, verifyEmail, resendVerificationCode };
