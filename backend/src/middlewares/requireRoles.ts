import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function requireRoles(...roles: string[]) {
  const allowed = roles.map(r => r.toUpperCase());

  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.users.findUnique({
      where: { id: req.tokenPayload?.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    if (!user.role || !allowed.includes(user.role)) {
      res.status(403).json({ error: 'Acceso denegado' });
      return;
    }
    next();
  };
}
