import { z } from 'zod';

const notificetionSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Message is required' }),
    message: z.string({ required_error: 'Message is required' }),
    userId: z.number({ required_error: 'User ID is required' }),
    status: z.enum(['read', 'unread']),
  }),
});

export const NotificationValidation = { notificetionSchema };
