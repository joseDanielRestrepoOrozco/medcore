import { z } from 'zod';

export const tokenPayloadSchema = z.object({
  userId: z.string(),
  email: z.email(),
  fullname: z.string(),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;
