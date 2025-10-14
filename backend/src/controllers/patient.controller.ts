import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import {
  patientCreateSchema,
  patientUpdateSchema,
  patientStateSchema,
  validateAge,
} from '../schemas/Patient';
import emailConfig from '../config/emailConfig';
import calculateAge from '../utils/calcAge';

const prisma = new PrismaClient();

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = patientCreateSchema.parse(req.body);
    const age = calculateAge(data.dateOfBirth);
    validateAge.parse(age);

    const verificationCode =
      emailConfig.generateVerificationCode?.() ||
      Math.random().toString(36).slice(2, 8).toUpperCase();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setHours(verificationCodeExpires.getHours() + 24);

    const patient = await prisma.patient.create({
      data: {
        ...data,
        age,
        verificationCode,
        verificationCodeExpires,
      },
    });

    try {
      await emailConfig.sendVerificationEmail?.(
        patient.email || '',
        `${patient.firstName} ${patient.lastName}`,
        verificationCode
      );
    } catch (e) {
      console.warn('Warning: could not send verification email', e);
    }

    res.status(201).json({ message: 'Paciente creado', patient });
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
    const where: Record<string, unknown> = {};
    if (state) where.state = state;

    const skip = (Number(page) - 1) * Number(limit);

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
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
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
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
    const data = patientUpdateSchema.parse(req.body);
    let age: number | undefined = undefined;
    if (data.dateOfBirth) {
      age = calculateAge(data.dateOfBirth);
      validateAge.parse(age);
    }

    // Use Prisma types for update data
    const updated = await prisma.patient.update({
      where: { id },
      data: {
        ...data,
        age,
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
    const { state } = patientStateSchema.parse(req.body);

    const updated = await prisma.patient.update({
      where: { id },
      data: { state },
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
