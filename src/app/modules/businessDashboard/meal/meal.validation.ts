import { array, z } from 'zod';

export const createMealSchema = z.object({
  body: z.object({
    shopId: z.string().min(1, 'Shop ID is required'),
    name: z.string().min(1, 'Meal name is required'),
    price: z.number().nonnegative('Price must be zero or a positive number'),
    offerPrice: z
      .number()
      .nonnegative('Offer price must be zero or a positive number')
      .optional(),
    category: z.string().min(1, 'Category is required'),
    image: z.string(),
    collectionTime: z.string().optional(),
    dietaryPreference: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    mealStatus: z.boolean().default(false),
  }),
});

const updateMealSchema = z.object({
  name: z.string().min(1, 'Meal name is required').optional(),
  price: z
    .number()
    .nonnegative('Price must be zero or a positive number')
    .optional(),
  offerPrice: z
    .number()
    .nonnegative('Offer price must be zero or a positive number')
    .optional(),
  category: z.string().min(1, 'Category is required').optional(),
  image: z
    .string({ required_error: 'Image is required' })
    .nonempty('Image is Required')
    .optional(),
  collectionTime: z.string().optional(),
  dietaryPreference: z.string().optional(),
  description: z.string().min(1, 'Description is required').optional(),
  mealStatus: z.boolean().default(false).optional(),
});

export const MealValidation = {
  createMealSchema,
  updateMealSchema,
};
