import type { TokenPayload } from './TokenPayload';
import { UserAuth } from './User';

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      tokenPayload?: TokenPayload;
      user?: UserAuth;
    }
  }
}

export {};
