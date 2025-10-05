import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import emailConfig from '../config/emailConfig';

const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.email('Email inválido'),
  fullname: z.string().min(1, 'Nombre completo requerido'),
  currentPassword: z.string().min(1, 'Contraseña requerida'),
  role: z.enum(['MEDICO', 'ENFERMERA', 'PACIENTE', 'ADMINISTRADOR']),
  specialization: z.string().optional(),
  department: z.string().optional(),
  licenseNumber: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional().transform((str) => str ? new Date(str) : undefined)
});

const bulkUsersSchema = z.array(userSchema);

// Obtener todos los usuarios
const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
  const { role, status, page = 1, limit = 10 } = req.query;

  const where: Prisma.UsersWhereInput = {};
  if (role && typeof role === 'string') where.role = role;
  if (status && typeof status === 'string') where.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullname: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
          // No incluir contraseñas en la respuesta
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.users.count({ where })
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: unknown) {
    next(error);
  }
};

// Crear usuario individual
const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = userSchema.parse(req.body);

    const existingUser = await prisma.users.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Usuario ya existe con este email' });
      return;
    }

    const verificationCode = emailConfig.generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 15);

    const newUser = await prisma.users.create({
      data: {
        email: userData.email,
        fullname: userData.fullname,
        currentPassword: await bcrypt.hash(userData.currentPassword, 10),
        role: userData.role,
        specialization: userData.specialization || null,
        department: userData.department || null,
        licenseNumber: userData.licenseNumber || null,
        phone: userData.phone || null,
        dateOfBirth: userData.dateOfBirth || null,
        verificationCode,
        verificationCodeExpires,
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        status: true,
        specialization: true,
        department: true,
        licenseNumber: true,
        phone: true,
        dateOfBirth: true,
        createdAt: true
      }
    });

    try {
      await emailConfig.sendVerificationEmail(
        userData.email,
        userData.fullname,
        verificationCode
      );
    } catch (emailError) {
      console.log('Warning: Could not send verification email:', emailError);
    }

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser
    });
  } catch (error: unknown) {
    next(error);
  }
};

// Carga masiva de usuarios
const bulkCreateUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usersData = bulkUsersSchema.parse(req.body.users || req.body);

    const results = {
      successful: [] as { index: number; user: unknown }[],
      failed: [] as { index: number; email: string; error: string }[],
      total: usersData.length
    };

    const batchSize = 10;
    for (let i = 0; i < usersData.length; i += batchSize) {
      const batch = usersData.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (userData, index) => {
          try {
            const existingUser = await prisma.users.findUnique({
              where: { email: userData.email }
            });

            if (existingUser) {
              results.failed.push({
                index: i + index,
                email: userData.email,
                error: 'Usuario ya existe'
              });
              return;
            }

            const verificationCode = emailConfig.generateVerificationCode();
            const verificationCodeExpires = new Date();
            verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 15);

            const newUser = await prisma.users.create({
              data: {
                email: userData.email,
                fullname: userData.fullname,
                currentPassword: await bcrypt.hash(userData.currentPassword, 10),
                role: userData.role,
                specialization: userData.specialization || null,
                department: userData.department || null,
                licenseNumber: userData.licenseNumber || null,
                phone: userData.phone || null,
                dateOfBirth: userData.dateOfBirth || null,
                verificationCode,
                verificationCodeExpires,
              },
              select: {
                id: true,
                email: true,
                fullname: true,
                role: true,
                status: true,
                specialization: true,
                department: true,
                licenseNumber: true,
                phone: true,
                dateOfBirth: true
              }
            });

            results.successful.push({
              index: i + index,
              user: newUser
            });
          } catch (userError: unknown) {
            const message = userError instanceof Error ? userError.message : 'Error desconocido';
            results.failed.push({
              index: i + index,
              email: userData.email,
              error: message
            });
          }
        })
      );
    }

    res.status(200).json({
      message: 'Carga masiva completada',
      summary: {
        total: results.total,
        successful: results.successful.length,
        failed: results.failed.length
      },
      results
    });
  } catch (error: unknown) {
    next(error);
  }
};

const getUsersByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.params;
    
    if (!['MEDICO', 'ENFERMERA', 'PACIENTE', 'ADMINISTRADOR'].includes(role.toUpperCase())) {
      res.status(400).json({ error: 'Rol inválido' });
      return;
    }

    const users = await prisma.users.findMany({
      where: { role: role.toUpperCase() },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      role: role.toUpperCase(),
      count: users.length,
      users
    });
  } catch (error: unknown) {
    next(error);
  }
};

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['MEDICO', 'ENFERMERA', 'PACIENTE', 'ADMINISTRADOR'].includes(role)) {
      res.status(400).json({ error: 'Rol inválido' });
      return;
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: 'Rol actualizado exitosamente',
      user: updatedUser
    });
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  getAllUsers,
  createUser,
  bulkCreateUsers,
  getUsersByRole,
  updateUserRole
};