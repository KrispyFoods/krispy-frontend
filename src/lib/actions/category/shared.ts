import { fail, validate } from '@/lib/actions/utils';
import { categorySchema } from '@/lib/schemas';
import { slugify } from '@/lib/slugify';

/** Pieces shared by the category actions (not an action itself, so no 'use server'). */

export const NOT_FOUND = 'Category not found.';

export const DUPLICATE = fail('That category already exists.', {
  name: 'A category with this name already exists.',
});

/** Validated name plus its slug, or a failure result ready to return. */
export function parseCategory(input: unknown) {
  const parsed = validate(categorySchema, input);
  if (!parsed.ok) return parsed;

  const slug = slugify(parsed.data.name);
  if (!slug) {
    return {
      ok: false as const,
      result: fail('Check the highlighted fields.', { name: 'Use letters or numbers in the name.' }),
    };
  }
  return { ok: true as const, data: { name: parsed.data.name, slug } };
}
