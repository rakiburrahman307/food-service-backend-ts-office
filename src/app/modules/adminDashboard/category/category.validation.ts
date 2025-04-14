import { z } from 'zod';

const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    status: z.enum(['active', 'inactive']).default('active'),
    image: z.string().optional(),
  }),
});
const categoryUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    status: z.enum(['active', 'inactive']).default('active').optional(),
    image: z.string().optional(),
  }),
});
const categoryStatusUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'inactive']),
  }),
});

export const CategoryValidation = {
  categorySchema,
  categoryUpdateSchema,
  categoryStatusUpdateSchema,
};
