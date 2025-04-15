import { z } from 'zod';
const createAccountSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});
export const StripeValidation = { createAccountSchema };
