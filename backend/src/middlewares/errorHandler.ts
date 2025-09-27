import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import z, { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2023') {
      res.status(400).json({ error: 'ID no válido' });
      return;
    }
    res.status(500).json({ error: 'Error en la base de datos' });
    return;
  } else if (error instanceof ZodError) {
    const flattened = z.flattenError(error);
    res.status(400).json({ errors: flattened.fieldErrors });
    return;
  } else if (error instanceof JsonWebTokenError) {
    res.status(401).json({ error: 'token no valido' });
    return;
  } else if (error instanceof TokenExpiredError) {
    res.status(401).json({
      error: 'token expirado',
    });
    return;
  }

  next(error);
};

export default errorHandler;
