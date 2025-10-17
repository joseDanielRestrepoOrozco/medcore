import type { TokenPayload } from './TokenPayload';
import { UserAuth } from './User';

declare global {
  namespace Express {
    interface Request {
      tokenPayload?: TokenPayload;
      user?: UserAuth;
    }
  }
}
