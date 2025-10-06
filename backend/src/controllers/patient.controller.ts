import { PrismaClient, Prisma, Patient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import {
  patientCreateSchema,
  patientUpdateSchema,
  patientStateSchema,
} from '../schemas/Patient';
import emailConfig from '../config/emailConfig';
import { parseBuffer } from '../utils/parseFile';

const prisma = new PrismaClient();

function calculateAge(dob: Date): number {
  const diff = Date.now() - dob.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = patientCreateSchema.parse(req.body);
    const dob = new Date(data.dateOfBirth);
    const age = calculateAge(dob);
    if (age < 0 || age > 100) {
      res.status(400).json({ error: 'Edad fuera de rango permitido (0-100)' });
      return;
    }

    const verificationCode =
      emailConfig.generateVerificationCode?.() ||
      Math.random().toString(36).slice(2, 8).toUpperCase();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setHours(verificationCodeExpires.getHours() + 24);

    const patient = await prisma.patient.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        gender: data.gender || null,
        dateOfBirth: dob,
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

    res
      .status(200)
      .json({
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

    const updateData: Prisma.PatientUpdateInput = {
      ...data,
    } as unknown as Prisma.PatientUpdateInput;
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth as string);
      updateData.dateOfBirth = dob;
      const age = calculateAge(dob);
      if (age < 0 || age > 100) {
        res
          .status(400)
          .json({ error: 'Edad fuera de rango permitido (0-100)' });
        return;
      }
      updateData.age = age;
    }

    // Use Prisma types for update data
    const updated = await prisma.patient.update({
      where: { id },
      data: updateData,
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

// Bulk import (JSON payload) — espera { patients: Array<Record<string,string>> }
export const bulkImportJson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patients = (req.body?.patients || []) as Array<
      Record<string, string>
    >;
    if (!Array.isArray(patients) || patients.length === 0) {
      res.status(400).json({ error: 'Sin datos para importar' });
      return;
    }
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ index: number; error: string }>,
    };
    for (let i = 0; i < patients.length; i++) {
      const row = patients[i];
      try {
        // map keys: firstName,lastName,email,phone,gender,dateOfBirth
        const payload = {
          firstName: row.firstName || row.nombre || row.first_name,
          lastName: row.lastName || row.apellido || row.last_name,
          email: row.email || row.correo || undefined,
          phone: row.phone || row.telefono || undefined,
          gender: (row.gender || row.genero || '').toUpperCase() || undefined,
          dateOfBirth:
            row.dateOfBirth || row.fecha_nacimiento || row.fechaNacimiento,
        };
        patientCreateSchema.parse(payload);
        const dob = new Date(String(payload.dateOfBirth));
        const age = calculateAge(dob);
        await prisma.patient.create({
          data: {
            firstName: String(payload.firstName),
            lastName: String(payload.lastName),
            email: payload.email || null,
            phone: payload.phone || null,
            gender: payload.gender || null,
            dateOfBirth: dob,
            age,
          },
        });
        results.successful++;
      } catch (e: any) {
        results.failed++;
        results.errors.push({ index: i, error: e?.message || 'Error' });
      }
    }
    res
      .status(200)
      .json({ message: 'Importación completada', summary: results });
  } catch (error: unknown) {
    next(error);
  }
};

async function bulkImportCsv(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ error: 'Archivo requerido' });
      return;
    }

    const rows = parseBuffer(file.buffer, file.originalname);

    const results = {
      successful: [] as Array<{ index: number; patient: Patient }>,
      failed: [] as Array<{
        index: number;
        row: Record<string, unknown>;
        error: string;
      }>,
      total: rows.length,
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const data = patientCreateSchema.parse(row);

        // calcular dob y edad
        const dob = new Date(data.dateOfBirth);
        const age = Math.floor(
          (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        );

        const verificationCode =
          emailConfig.generateVerificationCode?.() ||
          Math.random().toString(36).slice(2, 8).toUpperCase();
        const verificationCodeExpires = new Date();
        verificationCodeExpires.setHours(
          verificationCodeExpires.getHours() + 24
        );

        const patient = await prisma.patient.create({
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || null,
            phone: data.phone || null,
            gender: data.gender || null,
            dateOfBirth: dob,
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
          console.warn('Could not send verification email for bulk patient', e);
        }

        results.successful.push({ index: i, patient });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        results.failed.push({ index: i, row, error: message });
      }
    }

    res
      .status(200)
      .json({
        message: 'Importación completada',
        summary: {
          total: results.total,
          successful: results.successful.length,
          failed: results.failed.length,
        },
        results,
      });
  } catch (error: unknown) {
    next(error);
  }
}

export default {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  updatePatientState,
  bulkImportCsv,
  bulkImportJson,
};
