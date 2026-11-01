'use server';

import { updateTag } from 'next/cache';
import { checkDish, cleanUpImage, DUPLICATE, NOT_FOUND } from '@/lib/actions/dish/shared';
import { fail, invalidId, ok, requireAdmin, withDb } from '@/lib/actions/utils';
import { imageUrl } from '@/lib/cloudinary';
import { toDishDTO } from '@/lib/menu-mappers';
import type { ActionResult, DishDTO } from '@/lib/menu-types';
import { Dish } from '@/models';

export async function updateDish(id: string, input: unknown): Promise<ActionResult<DishDTO>> {
  const denied = await requireAdmin();
  if (denied) return denied;
  const bad = invalidId(id, NOT_FOUND);
  if (bad) return bad;

  return withDb(
    { label: 'updateDish', failMessage: 'Could not save the dish. Try again.', onDuplicate: DUPLICATE },
    async () => {
      const existing = await Dish.findById(id).lean();
      if (!existing) return fail(NOT_FOUND);

      const checked = await checkDish(input, id);
      if (!checked.ok) return checked.result;

      const { imagePublicId, ...fields } = checked.fields;
      const keepsPhoto = imagePublicId !== undefined && imagePublicId === existing.imagePublicId;
      const update = imagePublicId
        ? { $set: { ...fields, imagePublicId, image: keepsPhoto ? existing.image : imageUrl(imagePublicId) } }
        : { $set: fields, $unset: { image: '', imagePublicId: '' } };

      const doc = await Dish.findByIdAndUpdate(id, update, {
        returnDocument: 'after',
        runValidators: true,
      }).lean();
      if (!doc) return fail(NOT_FOUND);
      updateTag('dishes');

      if (existing.imagePublicId !== imagePublicId) cleanUpImage(existing.imagePublicId);
      return ok(toDishDTO(doc));
    },
  );
}
