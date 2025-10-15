import api from './api';

// Payload types
export type SignUpPayload = { fullname: string; email: string; current_password: string };
export type LoginPayload = { email: string; current_password: string };
export type VerifyEmailPayload = { email: string; verificationCode: string };
export type ResendVerificationPayload = { email: string };

// Response types
export type AuthUser = {
  id: string;
  email: string;
  fullname: string;
  status: string;
  // roles según backend (ES):
  // 'ADMINISTRADOR' | 'MEDICO' | 'PACIENTE' | 'ENFERMERA'
  role: string;
};

export type SignUpResponse = {
  id: AuthUser['id'];
  email: string;
  fullname: string;
  status: string;
  message: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
  token: string;
};

export type VerifyEmailResponse = {
  message: string;
  user: AuthUser;
};

export type ResendVerificationResponse = {
  message: string;
};

export const signUp = (payload: SignUpPayload) =>
  api.post<SignUpResponse>('/auth/sign-up', payload);

export const login = (payload: LoginPayload) =>
  api.post<LoginResponse>('/auth/log-in', payload);

export const verifyEmail = (payload: VerifyEmailPayload) =>
  api.post<VerifyEmailResponse>('/auth/verify-email', payload);

export const resendVerificationCode = (payload: ResendVerificationPayload) =>
  api.post<ResendVerificationResponse>('/auth/resend-verification-code', payload);
