import { z } from 'zod';
import { PIN_LENGTH } from '@/lib/auth/constants';
import { PUBLIC_ID_PATTERN } from '@/lib/image-constants';

/**
 * Shared by the server actions (authoritative) and the admin forms (instant messages),
 * so both sides always agree on what is valid.
 */

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Enter a category name.').max(60, 'Use 60 characters or fewer.'),
});

export const dishSchema = z.object({
  name: z.string().trim().min(1, 'Enter a dish name.').max(80, 'Use 80 characters or fewer.'),
  description: z.string().trim().max(500, 'Use 500 characters or fewer.'),
  price: z
    .number({ error: 'Enter a price.' })
    .int('Enter a whole number.')
    .min(0, 'Price cannot be negative.')
    .max(1_000_000, 'Price is too high.'),
  categoryId: z.string().regex(/^[a-f\d]{24}$/i, 'Choose a category.'),
  /** The photo is identified by its Cloudinary public id; the server builds the URL itself. */
  imagePublicId: z.string().regex(PUBLIC_ID_PATTERN, 'Upload the photo again.').optional(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});

export const pinSchema = z.object({
  pin: z.string().regex(new RegExp(`^\\d{${PIN_LENGTH}}$`), `Enter all ${PIN_LENGTH} digits.`),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type DishInput = z.infer<typeof dishSchema>;

/** First message per field, ready to show under each input. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    result[key] ??= issue.message;
  }
  return result;
}
