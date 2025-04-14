import { z } from 'zod';

const ShopLocationSchema = z.object({
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(coords => coords.length === 2, {
      message: 'Coordinates must be an array of exactly [longitude, latitude]',
    })
    .refine(coords => coords[0] >= -180 && coords[0] <= 180, {
      message: 'Longitude must be between -180 and 180',
    })
    .refine(coords => coords[1] >= -90 && coords[1] <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
});

const updateShopLocationSchema = z.object({
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(coords => coords.length === 2, {
      message: 'Coordinates must be an array of exactly [longitude, latitude]',
    })
    .refine(coords => coords[0] >= -180 && coords[0] <= 180, {
      message: 'Longitude must be between -180 and 180',
    })
    .refine(coords => coords[1] >= -90 && coords[1] <= 90, {
      message: 'Latitude must be between -90 and 90',
    })
    .optional(),
});

// Shop Schema
const cretaeShopSchema = z.object({
  body: z.object({
    shopName: z.string().min(1, 'Shop name is required'),
    shopOwnerName: z.string().min(1, 'Shop owner name is required'),
    shopLicence: z.string().min(1, 'Shop licence is required'),
    shopAddress: z.string().min(1, 'Shop location is required'),
    shopLocation: ShopLocationSchema,
    shopOpenTime: z.string().min(1, 'Shop open time is required'),
    shopCloseTime: z.string().min(1, 'Shop close time is required'),
    minOrderPrice: z
      .number()
      .nonnegative('Minimum order price must be zero or more'),
    minOrderOfferPrice: z
      .number()
      .nonnegative('Minimum order offer price must be zero or more'),
    logo: z.string().min(1, 'Shop logo is required').optional(),
    banner: z.string().min(1, 'Shop banner is required').optional(),
    shopDescription: z.string().min(1, 'Shop description is required'),
    turnOffShop: z.boolean().optional().default(false),
    status: z
      .enum(['active', 'blocked'], {
        message: "Status must be 'active' or 'blocked'",
      })
      .default('active'),
  }),
});

// update shop schema
const updateShopSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required').optional(),
  shopOwnerName: z.string().min(1, 'Shop owner name is required').optional(),
  shopLicence: z.string().min(1, 'Shop licence is required').optional(),
  shopAddress: z.string().min(1, 'Shop address is required').optional(),
  shopLocation: updateShopLocationSchema.optional(),
  shopOpenTime: z.string().min(1, 'Shop open time is required').optional(),
  shopCloseTime: z.string().min(1, 'Shop close time is required').optional(),
  minOrderPrice: z
    .number()
    .nonnegative('Minimum order price must be zero or more')
    .optional(),
  minOrderOfferPrice: z
    .number()
    .nonnegative('Minimum order offer price must be zero or more')
    .optional(),
  logo: z.string().min(1, 'Shop logo is required').optional(),
  banner: z.string().min(1, 'Shop banner is required').optional(),
  shopDescription: z.string().min(1, 'Shop description is required').optional(),
  turnOffShop: z.boolean().optional().default(false),
});

// Export the Zod schemas
export const ShopValidation = {
  cretaeShopSchema,
  updateShopSchema,
};
