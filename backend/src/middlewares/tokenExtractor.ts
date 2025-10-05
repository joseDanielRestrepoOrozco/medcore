import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../libs/config';
import { tokenPayloadSchema } from '../types/TokenPayload';

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ mensaje: 'No se envió token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = tokenPayloadSchema.parse(
      jwt.verify(token, SECRET as string)
    );
    req.tokenPayload = decoded;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default tokenExtractor;
