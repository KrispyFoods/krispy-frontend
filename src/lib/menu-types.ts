/**
 * Plain, serializable shapes of the Category and Dish Mongo documents (see src/models).
 * Ids are strings so they can cross the server -> client component boundary.
 */

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
}

export interface DishDTO {
  id: string;
  name: string;
  description: string;
  /** Whole LKR, e.g. 3900. */
  price: number;
  categoryId: string;
  image?: string;
  /** Lets the edit form tell an unchanged photo from a replaced one. */
  imagePublicId?: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

/** What every server action returns: never throws for expected failures. */
export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/** A dish as the public menu shows it. */
export interface MenuItemData {
  name: string;
  desc: string;
  /** Whole LKR, e.g. 3900. */
  price: number;
}

/** One category on the public menu with its available dishes. */
export interface MenuSectionData {
  section: string;
  items: MenuItemData[];
}

/** A dish on the home page's "Signature dishes" grid. */
export interface FeaturedDish extends MenuItemData {
  image?: { src: string; alt: string };
}

export type UploadStatus = 'idle' | 'processing' | 'uploading' | 'uploaded' | 'error';
