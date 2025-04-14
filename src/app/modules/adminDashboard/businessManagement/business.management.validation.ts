import { z } from 'zod';

const updateRevenue = z.object({
  body: z.object({
    revenue: z.number({ required_error: 'Revenue is required' }),
  }),
});
const updateShopStatus = z.object({
  body: z.object({
    status: z.string({ required_error: 'Status is required' }),
  }),
});

export const BusinessManagementValidation = { updateRevenue, updateShopStatus };
