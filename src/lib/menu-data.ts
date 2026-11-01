import { cacheLife, cacheTag } from 'next/cache';
import { groupDishesByCategory, toCategoryDTO, toDishDTO, toFeaturedDish } from '@/lib/menu-mappers';
import type { CategoryDTO, DishDTO, FeaturedDish, MenuSectionData } from '@/lib/menu-types';
import connectDB from '@/lib/mongodb';
import { Category, Dish } from '@/models';

/**
 * Cached, tag-invalidated reads of the menu collections. The server actions call updateTag() with
 * the same tags after every write, so the next read is always fresh.
 */

export async function getCategories(): Promise<CategoryDTO[]> {
  'use cache';
  cacheTag('categories');
  cacheLife('hours');

  await connectDB();
  const docs = await Category.find().sort({ createdAt: 1 }).lean();
  return docs.map(toCategoryDTO);
}

export async function getDishes(): Promise<DishDTO[]> {
  'use cache';
  cacheTag('dishes');
  cacheLife('hours');

  await connectDB();
  // Case-insensitive, so the order matches what the admin table shows after an insert (localeCompare).
  const docs = await Dish.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).lean();
  return docs.map(toDishDTO);
}

/** How many featured dishes the home page shows. */
const FEATURED_LIMIT = 6;

/** The public menu: every category that has at least one available dish. */
export async function getMenuSections(): Promise<MenuSectionData[]> {
  const [categories, dishes] = await Promise.all([getCategories(), getDishes()]);
  return groupDishesByCategory(categories, dishes);
}

/** The home page's "Signature dishes": available dishes marked Featured. */
export async function getFeaturedDishes(): Promise<FeaturedDish[]> {
  const dishes = await getDishes();
  return dishes
    .filter((dish) => dish.isAvailable && dish.isFeatured)
    .slice(0, FEATURED_LIMIT)
    .map(toFeaturedDish);
}
