'use server';

import { updateTag } from 'next/cache';
import { DUPLICATE, parseCategory } from '@/lib/actions/category/shared';
import { ok, withDb } from '@/lib/actions/utils';
import { toCategoryDTO } from '@/lib/menu-mappers';
import type { ActionResult, CategoryDTO } from '@/lib/menu-types';
import { Category } from '@/models';

export async function createCategory(input: unknown): Promise<ActionResult<CategoryDTO>> {
  const parsed = parseCategory(input);
  if (!parsed.ok) return parsed.result;

  return withDb(
    {
      label: 'createCategory',
      failMessage: 'Could not save the category. Try again.',
      onDuplicate: DUPLICATE,
    },
    async () => {
      const doc = await Category.create(parsed.data);
      updateTag('categories');
      return ok(toCategoryDTO(doc.toObject()));
    },
  );
}
