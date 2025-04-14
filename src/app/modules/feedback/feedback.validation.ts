import { z } from 'zod';
const feedbackSchema = z.object({
  body: z.object({
    shopId: z.string(),
    ratings: z
      .number()
      .min(1, 'Ratings must be between 1 and 5')
      .max(5, 'Ratings must be between 1 and 5'),
    comments: z
      .string()
      .optional(),
  }),
});

export const FeedbackValidation = {
  feedbackSchema,
};
