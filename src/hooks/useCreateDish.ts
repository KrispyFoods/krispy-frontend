'use client';

import { useQueryClient } from '@tanstack/react-query';
import { type SaveOptions, useActionMutation } from '@/hooks/useActionMutation';
import { compareDishes, DISHES_KEY } from '@/hooks/useDishes';
import { createDish } from '@/lib/actions/dish';
import type { DishDTO } from '@/lib/menu-types';
import { addToList } from '@/lib/query-cache';
import type { DishInput } from '@/lib/schemas';

export function useCreateDish({ onSuccess, onFieldErrors }: SaveOptions<DishDTO> = {}) {
  const queryClient = useQueryClient();

  return useActionMutation({
    action: (input: DishInput) => createDish(input),
    successMessage: (dish) => `Added ${dish.name}`,
    onSuccess: (dish) => {
      addToList(queryClient, DISHES_KEY, dish, compareDishes);
      onSuccess?.(dish);
    },
    onFieldErrors,
  });
}
