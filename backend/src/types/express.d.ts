import 'multer';
import type { TokenPayload } from './TokenPayload';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      tokenPayload?: TokenPayload;
    }
  }
}

export {};
