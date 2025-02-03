import { z } from 'zod';

// Bank Card Schema
const BankCardSchema = z.object({
  cardNumber: z.string().min(1, 'Card number is required'),
  cardHolderName: z.string().min(1, 'Card holder name is required'),
  expireDate: z.string().min(1, 'Expire date is required'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits'),
});

// Shop Schema
const ShopSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required'),
  shopOwnerName: z.string().min(1, 'Shop owner name is required'),
  shopLicence: z.string().min(1, 'Shop licence is required'),
  shopLocation: z.string().min(1, 'Shop location is required'),
  shopOpenTime: z.string().min(1, 'Shop open time is required'),
  shopCloseTime: z.string().min(1, 'Shop close time is required'),
  minOrderPrice: z
    .number()
    .nonnegative('Minimum order price must be zero or more'),
  bankCard: BankCardSchema,
  minOrderOfferPrice: z
    .number()
    .nonnegative('Minimum order offer price must be zero or more'),
  shopLogo: z.string().min(1, 'Shop logo is required'),
  shopBanner: z.string().min(1, 'Shop banner is required'),
  shopDescription: z.string().min(1, 'Shop description is required'),
  turnOffShop: z.boolean().optional().default(false),
});

// Export the Zod schemas
export { BankCardSchema, ShopSchema };

export const ShopValidation = {
  ShopSchema,
};
