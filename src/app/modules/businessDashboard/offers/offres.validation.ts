import { z } from 'zod';

export const offerSchema = z.object({
  body: z.object({
    shopId: z.string().min(1, 'Shop ID is required'),
    itemId: z.string().min(1, 'Item ID is required'),
    shopName: z.string().min(1, 'Shop name is required'),
    itemName: z.string().min(1, 'Item name is required'),
    shopCategory: z.string().min(1, 'Shop category is required'),
    image: z.string({required_error: "Image is required"}).nonempty("Image is Required"),
    offerTitle: z.string().min(1, 'Offer title is required'),
    discountPrice: z
      .number()
      .positive('Discount price must be a positive number'),
    stateDate: z
      .string()
      .refine(
        date => !isNaN(Date.parse(date)),
        'Start date must be a valid date'
      ),
    endDate: z
      .string()
      .refine(
        date => !isNaN(Date.parse(date)),
        'End date must be a valid date'
      ),
    description: z.string().min(1, 'Description is required'),
    status: z
      .enum(['panding', 'running', 'completed', 'reject'])
      .default('panding'),
  }),
});
const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['panding', 'running', 'completed']),
  }),
});

export const OffersValidation = {
  offerSchema,
  updateStatusSchema,
};
