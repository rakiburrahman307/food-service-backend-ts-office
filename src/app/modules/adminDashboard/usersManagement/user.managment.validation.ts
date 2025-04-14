import { z } from 'zod';

const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.string({ required_error: 'Status is required to update' }),
  }),
});

export const UserManagementValidation = { updateUserStatusSchema };
