'use server';

import { getDishes } from '@/lib/menu-data';
import type { DishDTO } from '@/lib/menu-types';

export async function listDishes(): Promise<DishDTO[]> {
  return getDishes();
}
