import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import emailConfig from '../config/emailConfig';
import { NextFunction, Request, Response } from 'express';
import { signupSchema } from '../schemas/Auth';

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = signupSchema.parse(req.body);

    const userExist = await prisma.users.findUnique({
      where: { email: newUser.email },
    });

    if (userExist) {
      console.log('User already exists');
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

    const emailResult = await emailConfig.sendVerificationEmail(
      newUser.email,
      newUser.fullname,
      verificationCode
    );

    if (!emailResult.success) {
      await prisma.users.delete({
        where: { id: createUser.id },
      });
      res.status(500).json({ message: 'Error sending verification email' });
      return;
    }

    res.status(201).json(createUser);
  } catch (error: unknown) {
    next(error);
  }
};

export default { signup };
