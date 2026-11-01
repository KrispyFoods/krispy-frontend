import { fail, logError, validate } from '@/lib/actions/utils';
import { destroyImage } from '@/lib/cloudinary';
import type { ActionResult } from '@/lib/menu-types';
import { dishSchema } from '@/lib/schemas';
import { Category, Dish } from '@/models';

/** Pieces shared by the dish actions (not an action itself, so no 'use server'). */

export const NOT_FOUND = 'Dish not found.';

export const DUPLICATE = fail('That dish already exists.', {
  name: 'This category already has a dish with that name.',
});

export interface DishFields {
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isFeatured: boolean;
  imagePublicId?: string;
}

/**
 * Validates a dish payload and the things only the database can answer: the category exists and the
 * photo is not already used by another dish. `dishId` is the dish being edited (its own photo is fine).
 */
export async function checkDish(
  input: unknown,
  dishId?: string,
): Promise<{ ok: true; fields: DishFields } | { ok: false; result: ActionResult<never> }> {
  const parsed = validate(dishSchema, input);
  if (!parsed.ok) return parsed;

  const { categoryId, ...rest } = parsed.data;
  const problems: Record<string, string> = {};

  if (!(await Category.exists({ _id: categoryId }))) problems.categoryId = 'That category no longer exists.';
  if (rest.imagePublicId) {
    const taken = await Dish.exists({
      imagePublicId: rest.imagePublicId,
      ...(dishId ? { _id: { $ne: dishId } } : {}),
    });
    if (taken) problems.image = 'That photo is already used by another dish.';
  }
  if (Object.keys(problems).length > 0) {
    return { ok: false, result: fail('Check the highlighted fields.', problems) };
  }
  return { ok: true, fields: { ...rest, category: categoryId } };
}

/** A leftover Cloudinary file is only clutter, so a failed cleanup is logged but never fails the request. */
export function cleanUpImage(publicId: string | null | undefined) {
  if (publicId) void destroyImage(publicId).catch((error) => logError('dish image cleanup', error));
}
