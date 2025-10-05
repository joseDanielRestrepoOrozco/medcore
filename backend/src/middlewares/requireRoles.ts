import { NextFunction, Request, Response } from 'express';

export function requireRoles(...roles: string[]) {
  const allowed = roles.map((r) => r.toUpperCase());
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req.tokenPayload as any)?.role?.toUpperCase();
    if (!role || !allowed.includes(role)) {
      res.status(403).json({ error: 'Acceso denegado' });
      return;
    }
    next();
  };
}

