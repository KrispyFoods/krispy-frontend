'use client';

import { useState } from 'react';
import { DishForm } from '@/components/organisms/DishForm';
import { DishTable } from '@/components/organisms/DishTable';
import { useCategories } from '@/hooks/useCategories';
import { useDishes } from '@/hooks/useDishes';
import type { CategoryDTO, DishDTO } from '@/lib/menu-types';

interface DishManagerProps {
  initialDishes: DishDTO[];
  initialCategories: CategoryDTO[];
}

export function DishManager({ initialDishes, initialCategories }: DishManagerProps) {
  const { data: dishes } = useDishes(initialDishes);
  const { data: categories } = useCategories(initialCategories);
  const [editing, setEditing] = useState<DishDTO | null>(null);

  return (
    <div className="space-y-6">
      {/* Remounting on `key` resets the form's state when a different row is opened. */}
      <DishForm
        key={editing?.id ?? 'new'}
        editing={editing}
        categories={categories}
        onDone={() => setEditing(null)}
      />
      <DishTable
        dishes={dishes}
        categories={categories}
        editingId={editing?.id}
        onEdit={setEditing}
        onDeleted={(id) => {
          if (editing?.id === id) setEditing(null);
        }}
      />
    </div>
  );
}
