import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const SECRET = process.env.SECRET;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = Number(process.env.SMTP_PORT);
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_SECURE = process.env.SMTP_SECURE;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
export const NODE_ENV = process.env.NODE_ENV;
