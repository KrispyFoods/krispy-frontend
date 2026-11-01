'use client';

import { useQuery } from '@tanstack/react-query';
import { listDishes } from '@/lib/actions/dish';
import type { DishDTO } from '@/lib/menu-types';

export const DISHES_KEY = ['dishes'] as const;

/** Dishes are listed A to Z, so inserts and edits keep the table in the order the server returns. */
export const compareDishes = (a: DishDTO, b: DishDTO) => a.name.localeCompare(b.name);

/** `initialData` comes from the server component, so the first paint never waits on a fetch. */
export function useDishes(initialData: DishDTO[]) {
  return useQuery({ queryKey: DISHES_KEY, queryFn: listDishes, initialData });
}
