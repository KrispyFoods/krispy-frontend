import type { CategoryDTO, DishDTO, FeaturedDish, MenuSectionData } from '@/lib/menu-types';

/** Map Mongo documents (lean or toObject()) to the plain shapes sent to client components. */
export function toCategoryDTO(doc: { _id: unknown; name: string; slug: string }): CategoryDTO {
  return { id: String(doc._id), name: doc.name, slug: doc.slug };
}

export function toDishDTO(doc: {
  _id: unknown;
  name: string;
  description?: string | null;
  price: number;
  category: unknown;
  image?: string | null;
  imagePublicId?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}): DishDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    description: doc.description ?? '',
    price: doc.price,
    categoryId: String(doc.category),
    ...(doc.image ? { image: doc.image } : {}),
    ...(doc.imagePublicId ? { imagePublicId: doc.imagePublicId } : {}),
    isAvailable: doc.isAvailable,
    isFeatured: doc.isFeatured,
  };
}

/** Categories in order, each with its available dishes; categories with nothing to show are dropped. */
export function groupDishesByCategory(categories: CategoryDTO[], dishes: DishDTO[]): MenuSectionData[] {
  return categories
    .map((category) => ({
      section: category.name,
      items: dishes
        .filter((dish) => dish.isAvailable && dish.categoryId === category.id)
        .map(({ name, description, price }) => ({ name, desc: description, price })),
    }))
    .filter((section) => section.items.length > 0);
}

/** An available, featured dish as the home page's "Signature dishes" grid shows it. */
export function toFeaturedDish(dish: DishDTO): FeaturedDish {
  return {
    name: dish.name,
    desc: dish.description,
    price: dish.price,
    ...(dish.image ? { image: { src: dish.image, alt: dish.name } } : {}),
  };
}
