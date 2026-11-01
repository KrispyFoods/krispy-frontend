'use client';

import { useQuery } from '@tanstack/react-query';
import { listCategories } from '@/lib/actions/category';
import type { CategoryDTO } from '@/lib/menu-types';

export const CATEGORIES_KEY = ['categories'] as const;

/** `initialData` comes from the server component, so the first paint never waits on a fetch. */
export function useCategories(initialData: CategoryDTO[]) {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: listCategories, initialData });
}
