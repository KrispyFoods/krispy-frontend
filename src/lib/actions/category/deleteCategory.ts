'use server';

import { updateTag } from 'next/cache';
import { NOT_FOUND } from '@/lib/actions/category/shared';
import { fail, invalidId, ok, requireAdmin, withDb } from '@/lib/actions/utils';
import type { ActionResult } from '@/lib/menu-types';
import { Category, Dish } from '@/models';

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  const denied = await requireAdmin();
  if (denied) return denied;
  const bad = invalidId(id, NOT_FOUND);
  if (bad) return bad;

  return withDb(
    { label: 'deleteCategory', failMessage: 'Could not delete the category. Try again.' },
    async () => {
      const inUse = await Dish.countDocuments({ category: id });
      if (inUse > 0) return fail(`Remove its ${inUse} ${inUse === 1 ? 'dish' : 'dishes'} first.`);

      await Category.findByIdAndDelete(id);
      updateTag('categories');
      return ok(null);
    },
  );
}
