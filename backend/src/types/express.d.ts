import 'multer';
import type { TokenPayload } from './TokenPayload';

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
      tokenPayload?: TokenPayload;
    }
  }
}

export {};
