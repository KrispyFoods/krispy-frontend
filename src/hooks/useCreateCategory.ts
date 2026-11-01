'use client';

import { useQueryClient } from '@tanstack/react-query';
import { type SaveOptions, useActionMutation } from '@/hooks/useActionMutation';
import { CATEGORIES_KEY } from '@/hooks/useCategories';
import { createCategory } from '@/lib/actions/category';
import type { CategoryDTO } from '@/lib/menu-types';
import { addToList } from '@/lib/query-cache';
import type { CategoryInput } from '@/lib/schemas';

export function useCreateCategory({ onSuccess, onFieldErrors }: SaveOptions<CategoryDTO> = {}) {
  const queryClient = useQueryClient();

  return useActionMutation({
    action: (input: CategoryInput) => createCategory(input),
    successMessage: (category) => `Added ${category.name}`,
    onSuccess: (category) => {
      addToList(queryClient, CATEGORIES_KEY, category);
      onSuccess?.(category);
    },
    onFieldErrors,
  });
}
