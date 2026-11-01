'use server';

import { updateTag } from 'next/cache';
import { checkDish, DUPLICATE } from '@/lib/actions/dish/shared';
import { ok, requireAdmin, withDb } from '@/lib/actions/utils';
import { imageUrl } from '@/lib/cloudinary';
import { toDishDTO } from '@/lib/menu-mappers';
import type { ActionResult, DishDTO } from '@/lib/menu-types';
import { Dish } from '@/models';

export async function createDish(input: unknown): Promise<ActionResult<DishDTO>> {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withDb(
    { label: 'createDish', failMessage: 'Could not save the dish. Try again.', onDuplicate: DUPLICATE },
    async () => {
      const checked = await checkDish(input);
      if (!checked.ok) return checked.result;

      const { imagePublicId, ...fields } = checked.fields;
      const doc = await Dish.create({
        ...fields,
        ...(imagePublicId ? { imagePublicId, image: imageUrl(imagePublicId) } : {}),
      });
      updateTag('dishes');
      return ok(toDishDTO(doc.toObject()));
    },
  );
}
