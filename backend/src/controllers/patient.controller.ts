import { PrismaClient, Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import emailConfig from '../config/emailConfig';
import calculateAge from '../utils/calcAge';
import {
  patientStateSchema,
  patientWithoutRoleSchema,
  validateAge,
} from '../schemas/Auth';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = patientWithoutRoleSchema.parse(req.body);
    const age = calculateAge(data.date_of_birth);
    validateAge.parse(age);

    const verificationCode =
      emailConfig.generateVerificationCode?.() ||
      Math.random().toString(36).slice(2, 8).toUpperCase();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setHours(verificationCodeExpires.getHours() + 24);

    const patient = await prisma.users.create({
      data: {
        ...data,
        role: Role.PACIENTE,
        date_of_birth: new Date(data.date_of_birth),
        age,
        current_password: await bcrypt.hash(data.current_password, 10),
        verificationCode,
        verificationCodeExpires,
      },
    });

    try {
      await emailConfig.sendVerificationEmail?.(
        patient.email,
        `${patient.fullname}`,
        verificationCode
      );
    } catch (e) {
      console.warn('Warning: could not send verification email', e);
    }

    res
      .status(201)
      .json({
        message: 'Paciente creado',
        patient: {
          id: patient.id,
          email: patient.email,
          fullname: patient.fullname,
          date_of_birth: patient.date_of_birth,
          age: patient.age,
          status: patient.status,
          phone: patient.phone,
          gender: patient.gender,
        },
      });
  } catch (error: unknown) {
    next(error);
  }
};

const listPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      state,
    } = req.query as Record<string, string>;
    const where: Record<string, unknown> = { role: Role.PACIENTE };
    if (state) where.state = state;

    const skip = (Number(page) - 1) * Number(limit);

    const [patients, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.users.count({ where }),
    ]);

    res.status(200).json({
      patients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};

const getPatientById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const patient = await prisma.users.findUnique({ where: { id } });

    if (!patient || patient.role !== Role.PACIENTE) {
      res.status(404).json({ error: 'Paciente no encontrado' });
      return;
    }
    res.status(200).json({ patient });
  } catch (error: unknown) {
    next(error);
  }
};

const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = patientWithoutRoleSchema.parse(req.body);
    const age = calculateAge(data.date_of_birth);
    validateAge.parse(age);

    // Use Prisma types for update data
    const updated = await prisma.users.update({
      where: { id, role: Role.PACIENTE },
      data: {
        ...data,
        date_of_birth: new Date(data.date_of_birth),
        age,
        current_password: await bcrypt.hash(data.current_password, 10),
      },
    });

    res.status(200).json({ message: 'Paciente actualizado', patient: updated });
  } catch (error: unknown) {
    next(error);
  }
};

const updatePatientState = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = patientStateSchema.parse(req.body);

    const updated = await prisma.users.update({
      where: { id },
      data: { status },
    });
    res.status(200).json({ message: 'Estado actualizado', patient: updated });
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  updatePatientState,
};
