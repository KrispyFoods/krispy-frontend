'use server';

import { getCategories } from '@/lib/menu-data';
import type { CategoryDTO } from '@/lib/menu-types';

export async function listCategories(): Promise<CategoryDTO[]> {
  return getCategories();
}
