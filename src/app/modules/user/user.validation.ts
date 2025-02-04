import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
    location: z.string({ required_error: 'Location is required' }),
    profile: z.string().optional(),
  }),
});
const createBusinessUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
    profile: z.string().optional(),
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  createBusinessUserZodSchema,
};
