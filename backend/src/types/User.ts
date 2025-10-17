export interface UserAuth {
  id: string;
  email: string;
  fullname: string;
  role: string;
  specialization?: string | null;
  date_of_birth: Date;
  age: number;
  status: string; // 'PENDING', 'ACTIVE', 'INACTIVE', etc. (según tu enum)
  verificationCode?: string | null;
  verificationCodeExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
