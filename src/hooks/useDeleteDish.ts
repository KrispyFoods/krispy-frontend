'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useActionMutation } from '@/hooks/useActionMutation';
import { DISHES_KEY } from '@/hooks/useDishes';
import { deleteDish } from '@/lib/actions/dish';
import type { DishDTO } from '@/lib/menu-types';
import { removeFromList } from '@/lib/query-cache';

export function useDeleteDish({ onSuccess }: { onSuccess?: (id: string) => void } = {}) {
  const queryClient = useQueryClient();

  return useActionMutation({
    action: (id: string) => deleteDish(id),
    successMessage: 'Dish deleted',
    onSuccess: (_data, id) => {
      removeFromList<DishDTO>(queryClient, DISHES_KEY, id);
      onSuccess?.(id);
    },
  });
}
