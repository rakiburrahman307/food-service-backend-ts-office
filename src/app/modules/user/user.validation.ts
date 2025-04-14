import { boolean, string, z } from 'zod';
const LocationSchema = z.object({
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(coords => coords.length === 2, {
      message: 'Coordinates must be an array of exactly [longitude, latitude]',
    }),
});
export const createUserZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters long'),
    address: z
      .string({ required_error: 'Contact is required' })
      .min(5, 'Contact must be at least 5 characters')
      .optional(),

    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),

    location: LocationSchema.optional(),
    order: boolean().default(false),
    phone: string().default('').optional(),
    profile: z.string().optional(),
  }),
});

const createBusinessUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    phone: z.string({ required_error: 'Contact is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
    profile: z.string().optional(),
  }),
});
const updateLocationZodSchema = z.object({
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(coords => coords.length === 2, {
      message: 'Coordinates must be an array of exactly [longitude, latitude]',
    })
    .optional(),
});
const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contact: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().optional(),
    location: updateLocationZodSchema.optional(),
    image: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  createBusinessUserZodSchema,
  updateLocationZodSchema,
};
