import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { DiagnosticDataType } from '../schemas/DiagnosticData';
const prisma = new PrismaClient();

class DiagnosticService {
  async createDiagnostic(
    patientId: string,
    doctorId: string,
    diagnosticData: DiagnosticDataType,
    files?: Express.Multer.File[]
  ) {
    // Lógica para crear un diagnóstico
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: { user: true },
      });

      if (!patient) {
        throw new Error('Paciente no encontrado');
      }

      if (patient.state === 'INACTIVE') {
        throw new Error(
          'No se puede crear un diagnostico para paciente inactivo'
        );
      }

      const doctor = await prisma.users.findUnique({
        where: { id: doctorId },
      });

      if (
        !doctor ||
        (doctor.role !== 'MEDICO' && doctor.role !== 'ADMINISTRADOR')
      ) {
        throw new Error(
          'Solo los médicos o administradores pueden crear diagnósticos'
        );
      }

      const diagnostic = await prisma.$transaction(async tx => {
        const newDiagnostic = await tx.diagnostic.create({
          data: {
            patientId,
            doctorId,
            title: diagnosticData.title,
            description: diagnosticData.description,
            symptoms: diagnosticData.symptoms,
            diagnosis: diagnosticData.diagnosis,
            treatment: diagnosticData.treatment,
            observations: diagnosticData.observations || null,
            nextAppointment: diagnosticData.nextAppointment
              ? new Date(diagnosticData.nextAppointment)
              : null,
          },
        });

        if (files && files.length > 0) {
          const documentRecords = files.map(file => ({
            diagnosticId: newDiagnostic.id,
            filename: file.originalname,
            storedFilename: file.filename,
            filePath: file.path,
            fileType: file.originalname
              .split('.')
              .pop()
              ?.toLowerCase() as string,
            mimeType: file.mimetype,
            fileSize: file.size,
            description: null,
            uploadedBy: doctorId,
          }));

          await tx.diagnosticDocument.createMany({
            data: documentRecords,
          });
        }

        return await tx.diagnostic.findUnique({
          where: { id: newDiagnostic.id },
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullname: true,
                    email: true,
                  },
                },
              },
            },
            doctor: {
              select: {
                id: true,
                fullname: true,
                email: true,
                specialization: true,
              },
            },
            documents: true,
          },
        });
      });

      return diagnostic;
    } catch (error) {
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            await fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error(
              `Error al eliminar el archivo ${file.path}:`,
              unlinkError
            );
          }
        }
      }

      throw error;
    }
  }
}

export default new DiagnosticService();
