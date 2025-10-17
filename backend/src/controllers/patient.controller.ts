import { PrismaClient, State } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { DiagnosticData } from '../schemas/DiagnosticData';
import DiagnosticService from '../services/diagnostic.service';
import {
  PatientSchema,
  patientStateSchema,
  UpdatePatientSchema,
} from '../schemas/Patient';

const prisma = new PrismaClient();

const createDiagnostic = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user?.id as string;
    const files = req.files as Express.Multer.File[];

    const diagnosticData = DiagnosticData.parse(req.body);

    const diagnostic = await DiagnosticService.createDiagnostic(
      patientId,
      doctorId,
      diagnosticData,
      files
    );

    res.status(201).json({
      message: 'Diagnóstico creado exitosamente',
      data: diagnostic,
    });
    return;
  } catch (error) {
    console.error('Error creando diagnóstico:', error);
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: error.message || 'Error al crear diagnostico' });
    }
  }
};

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = PatientSchema.parse(req.body);

    const patient = await prisma.patient.create({
      data,
    });

    res.status(201).json({
      message: 'Paciente creado',
      patient,
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
    // Parseo de parámetros de consulta
    const { state } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Validar y convertir el valor de state al tipo correcto
    const where: { state?: State } = {};
    if (state === State.ACTIVE || state === State.INACTIVE) {
      where.state = state as State;
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    res.status(200).json({
      patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
    const data = UpdatePatientSchema.parse(req.body);
    // Use Prisma types for update data
    const updated = await prisma.patient.update({
      where: { id },
      data,
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
  createDiagnostic,
};
