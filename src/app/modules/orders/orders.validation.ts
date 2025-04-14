import { z } from 'zod';

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'preparing', 'ready for pickup', 'delivered']),
  }),
});
const cancelOrderSchema = z.object({
  body: z.object({
    status: z.enum(['delivered']),
  }),
});

export const OrdersValidation = { updateStatusSchema, cancelOrderSchema };
