import { z } from 'zod';

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
    image: z.string().url('Picture URL must be a valid URL').optional(),
    collectionTime: z.string().optional(),
    dietaryPreference: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    mealStatus: z.boolean().default(false),
  }),
});

const updateMealSchema = createMealSchema.partial();

export const MealValidation = {
  createMealSchema,
  updateMealSchema,
};
