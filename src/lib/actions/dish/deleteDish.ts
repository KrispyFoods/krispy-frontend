'use server';

import { updateTag } from 'next/cache';
import { cleanUpImage, NOT_FOUND } from '@/lib/actions/dish/shared';
import { invalidId, ok, requireAdmin, withDb } from '@/lib/actions/utils';
import type { ActionResult } from '@/lib/menu-types';
import { Dish } from '@/models';

export async function deleteDish(id: string): Promise<ActionResult<null>> {
  const denied = await requireAdmin();
  if (denied) return denied;
  const bad = invalidId(id, NOT_FOUND);
  if (bad) return bad;

  return withDb({ label: 'deleteDish', failMessage: 'Could not delete the dish. Try again.' }, async () => {
    const doc = await Dish.findByIdAndDelete(id).lean();
    updateTag('dishes');
    cleanUpImage(doc?.imagePublicId);
    return ok(null);
  });
}
