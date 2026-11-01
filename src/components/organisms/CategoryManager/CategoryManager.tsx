'use client';

import { useState } from 'react';
import { CategoryForm } from '@/components/organisms/CategoryForm';
import { CategoryTable } from '@/components/organisms/CategoryTable';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryDTO } from '@/lib/menu-types';

export function CategoryManager({ initialCategories }: { initialCategories: CategoryDTO[] }) {
  const { data: categories } = useCategories(initialCategories);
  const [editing, setEditing] = useState<CategoryDTO | null>(null);

  return (
    <div className="space-y-6">
      {/* Remounting on `key` resets the form's state when a different row is opened. */}
      <CategoryForm key={editing?.id ?? 'new'} editing={editing} onDone={() => setEditing(null)} />
      <CategoryTable
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
