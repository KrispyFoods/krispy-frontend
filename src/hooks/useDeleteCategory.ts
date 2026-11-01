'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useActionMutation } from '@/hooks/useActionMutation';
import { CATEGORIES_KEY } from '@/hooks/useCategories';
import { deleteCategory } from '@/lib/actions/category';
import type { CategoryDTO } from '@/lib/menu-types';
import { removeFromList } from '@/lib/query-cache';

export function useDeleteCategory({ onSuccess }: { onSuccess?: (id: string) => void } = {}) {
  const queryClient = useQueryClient();

  return useActionMutation({
    action: (id: string) => deleteCategory(id),
    successMessage: 'Category deleted',
    onSuccess: (_data, id) => {
      removeFromList<CategoryDTO>(queryClient, CATEGORIES_KEY, id);
      onSuccess?.(id);
    },
  });
}
