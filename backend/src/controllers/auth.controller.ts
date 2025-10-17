import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailConfig from '../config/emailConfig';
import { NextFunction, Request, Response } from 'express';
import {
  userSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationCodeSchema,
  validateAge,
} from '../schemas/Auth';
import { SECRET } from '../libs/config';
import calculateAge from '../utils/calcAge';

const prisma = new PrismaClient();

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bodyWhitRole = { role: req.body.role || 'PACIENTE', ...req.body };
    const newUser = userSchema.parse(bodyWhitRole);
    console.log('[signup] request', {
      email: newUser.email,
      fullname: newUser.fullname,
    });

    const userExist = await prisma.users.findUnique({
      where: { email: newUser.email },
      select: { id: true },
    });

    if (userExist) {
      console.log('User already exists');
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const age = calculateAge(newUser.date_of_birth);
    validateAge.parse(age);

    const verificationCode = emailConfig.generateVerificationCode();

    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 15
    );

    const createUser = await prisma.users.create({
      data: {
        ...newUser,
        age,
        date_of_birth: new Date(newUser.date_of_birth),
        current_password: await bcrypt.hash(newUser.current_password, 10),
        verificationCode,
        verificationCodeExpires,
      },
    });
    console.log('[signup] user created', {
      id: createUser.id,
      email: createUser.email,
    });

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
      role: createUser.role,
      message: 'Usuario creado. Código enviado al correo.',
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
    const loginData = loginSchema.parse(req.body);

    const user = await prisma.users.findUnique({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        fullname: true,
        status: true,
        role: true,
        current_password: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    if (user.status !== 'ACTIVE') {
      res.status(401).json({ error: 'Email no verificado. Revisa tu correo.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      loginData.current_password,
      user.current_password
    );

    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    if (!SECRET) {
      res.status(500).json({ error: 'Error de configuración del servidor' });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
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
        role: user.role,
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
    const verifyData = verifyEmailSchema.parse(req.body);

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

    if (user.status === 'ACTIVE') {
      res.status(400).json({ error: 'Usuario ya verificado' });
      return;
    }

    if (user.verificationCode !== verifyData.verificationCode) {
      res.status(400).json({ error: 'Código de verificación inválido' });
      return;
    }

    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    ) {
      res.status(400).json({ error: 'Código de verificación expirado' });
      return;
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
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
    const resendData = resendVerificationCodeSchema.parse(req.body);

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

    if (user.status === 'ACTIVE') {
      res.status(400).json({ error: 'Usuario ya verificado' });
      return;
    }

    const verificationCode = emailConfig.generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 15
    );

    await prisma.users.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpires,
      },
    });

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

export default {
  signup,
  login,
  verifyEmail,
  resendVerificationCode,
};
