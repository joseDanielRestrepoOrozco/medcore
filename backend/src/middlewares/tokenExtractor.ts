import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET } from '../libs/config';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ mensaje: 'No se envió token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET as string) as JwtPayload;
    req.user = decoded; // attach user info al request
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default authMiddleware;
