import { NextFunction, Request, Response } from 'express';
import { PrismaClient, Patient } from '@prisma/client';
import emailConfig from '../config/emailConfig';
import { parseBuffer } from '../utils/parseFile';
import { patientCreateSchema } from '../schemas/Patient';

const prisma = new PrismaClient();

async function bulkImportPatients(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ error: 'Archivo requerido' });
      return;
    }

    const rows = parseBuffer(file.buffer, file.originalname);

    const results = {
      successful: [] as Array<{ index: number; patient: Patient }>,
      failed: [] as Array<{ index: number; row: Record<string, unknown>; error: string }>,
      total: rows.length
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const data = patientCreateSchema.parse(row);

        // calcular dob y edad
        const dob = new Date(data.dateOfBirth);
        const age = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

        const verificationCode = emailConfig.generateVerificationCode?.() || Math.random().toString(36).slice(2, 8).toUpperCase();
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
          }
        });

        try {
          await emailConfig.sendVerificationEmail?.(patient.email || '', `${patient.firstName} ${patient.lastName}`, verificationCode);
        } catch (e) {
          console.warn('Could not send verification email for bulk patient', e);
        }

        results.successful.push({ index: i, patient });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        results.failed.push({ index: i, row, error: message });
      }
    }

    res.status(200).json({ message: 'Importación completada', summary: { total: results.total, successful: results.successful.length, failed: results.failed.length }, results });
  } catch (error: unknown) {
    next(error);
  }
}

export default { bulkImportPatients };
