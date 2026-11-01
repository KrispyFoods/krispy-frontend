'use server';

import { updateTag } from 'next/cache';
import { DUPLICATE, NOT_FOUND, parseCategory } from '@/lib/actions/category/shared';
import { fail, invalidId, ok, withDb } from '@/lib/actions/utils';
import { toCategoryDTO } from '@/lib/menu-mappers';
import type { ActionResult, CategoryDTO } from '@/lib/menu-types';
import { Category } from '@/models';

export async function updateCategory(id: string, input: unknown): Promise<ActionResult<CategoryDTO>> {
  const bad = invalidId(id, NOT_FOUND);
  if (bad) return bad;
  const parsed = parseCategory(input);
  if (!parsed.ok) return parsed.result;

  return withDb(
    {
      label: 'updateCategory',
      failMessage: 'Could not save the category. Try again.',
      onDuplicate: DUPLICATE,
    },
    async () => {
      const doc = await Category.findByIdAndUpdate(id, parsed.data, {
        returnDocument: 'after',
        runValidators: true,
      }).lean();
      if (!doc) return fail(NOT_FOUND);
      updateTag('categories');
      return ok(toCategoryDTO(doc));
    },
  );
}
