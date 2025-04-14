import { z } from 'zod';

// Product schema
const productSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  shopId: z.string().min(1, 'Shop ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().min(1, 'Quantity should be at least 1'),
  price: z.number().min(0, 'Price cannot be negative'),
});
// Payment schema
const paymentSchema = z.object({
  body: z.object({
    products: z.array(productSchema),
  }),
});

export const PaymentValidation = { paymentSchema };
