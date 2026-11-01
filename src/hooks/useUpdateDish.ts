'use client';

import { useQueryClient } from '@tanstack/react-query';
import { type SaveOptions, useActionMutation } from '@/hooks/useActionMutation';
import { compareDishes, DISHES_KEY } from '@/hooks/useDishes';
import { updateDish } from '@/lib/actions/dish';
import type { DishDTO } from '@/lib/menu-types';
import { replaceInList } from '@/lib/query-cache';
import type { DishInput } from '@/lib/schemas';

export function useUpdateDish({ onSuccess, onFieldErrors }: SaveOptions<DishDTO> = {}) {
  const queryClient = useQueryClient();

  return useActionMutation({
    action: ({ id, input }: { id: string; input: DishInput }) => updateDish(id, input),
    successMessage: (dish) => `Saved ${dish.name}`,
    onSuccess: (dish) => {
      replaceInList(queryClient, DISHES_KEY, dish, compareDishes);
      onSuccess?.(dish);
    },
    onFieldErrors,
  });
}
