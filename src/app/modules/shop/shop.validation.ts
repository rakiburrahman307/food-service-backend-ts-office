import { z } from 'zod';

// Bank Card Schema
const bankCardSchema = z.object({
  cardNumber: z.string().min(1, 'Card number is required'),
  cardHolderName: z.string().min(1, 'Card holder name is required'),
  expireDate: z.string().min(1, 'Expire date is required'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits'),
});
// update Bank Card Schema
const updateBankCardSchema = z.object({
  cardNumber: z.string().min(1, 'Card number is required').optional(),
  cardHolderName: z.string().min(1, 'Card holder name is required').optional(),
  expireDate: z.string().min(1, 'Expire date is required').optional(),
  cvv: z.string().min(3, 'CVV must be at least 3 digits').optional(),
});

// Shop Schema
const cretaeShopSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required'),
  shopOwnerName: z.string().min(1, 'Shop owner name is required'),
  shopLicence: z.string().min(1, 'Shop licence is required'),
  shopLocation: z.string().min(1, 'Shop location is required'),
  shopOpenTime: z.string().min(1, 'Shop open time is required'),
  shopCloseTime: z.string().min(1, 'Shop close time is required'),
  minOrderPrice: z
    .number()
    .nonnegative('Minimum order price must be zero or more'),
  bankCard: bankCardSchema,
  minOrderOfferPrice: z
    .number()
    .nonnegative('Minimum order offer price must be zero or more'),
  shopLogo: z.string().min(1, 'Shop logo is required'),
  shopBanner: z.string().min(1, 'Shop banner is required'),
  shopDescription: z.string().min(1, 'Shop description is required'),
  turnOffShop: z.boolean().optional().default(false),
});

// update shop schema
const updateShopSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required').optional(),
  shopOwnerName: z.string().min(1, 'Shop owner name is required').optional(),
  shopLicence: z.string().min(1, 'Shop licence is required').optional(),
  shopLocation: z.string().min(1, 'Shop location is required').optional(),
  shopOpenTime: z.string().min(1, 'Shop open time is required').optional(),
  shopCloseTime: z.string().min(1, 'Shop close time is required').optional(),
  minOrderPrice: z
    .number()
    .nonnegative('Minimum order price must be zero or more').optional(),
  bankCard: updateBankCardSchema,
  minOrderOfferPrice: z
    .number()
    .nonnegative('Minimum order offer price must be zero or more').optional(),
  shopLogo: z.string().min(1, 'Shop logo is required').optional(),
  shopBanner: z.string().min(1, 'Shop banner is required').optional(),
  shopDescription: z.string().min(1, 'Shop description is required').optional(),
  turnOffShop: z.boolean().optional().default(false),
});

// Export the Zod schemas
export const ShopValidation = {
  cretaeShopSchema,
  updateShopSchema,
};
