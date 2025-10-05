import { TokenPayload } from './TokenPayload';

declare module 'express' {
  export interface Request {
    tokenPayload?: TokenPayload;
  }
}
