'use client';

import { useQueryClient } from '@tanstack/react-query';
import { type SaveOptions, useActionMutation } from '@/hooks/useActionMutation';
import { CATEGORIES_KEY } from '@/hooks/useCategories';
import { updateCategory } from '@/lib/actions/category';
import type { CategoryDTO } from '@/lib/menu-types';
import { replaceInList } from '@/lib/query-cache';
import type { CategoryInput } from '@/lib/schemas';

export function useUpdateCategory({ onSuccess, onFieldErrors }: SaveOptions<CategoryDTO> = {}) {
  const queryClient = useQueryClient();

  return useActionMutation({
    action: ({ id, input }: { id: string; input: CategoryInput }) => updateCategory(id, input),
    successMessage: (category) => `Saved ${category.name}`,
    onSuccess: (category) => {
      replaceInList(queryClient, CATEGORIES_KEY, category);
      onSuccess?.(category);
    },
    onFieldErrors,
  });
}
