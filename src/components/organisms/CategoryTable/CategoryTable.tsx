'use client';

import { RowActions, TableCard, type TableColumn } from '@/components/molecules';
import { TableCell, TableRow } from '@/components/ui';
import { useDeleteCategory } from '@/hooks/useDeleteCategory';
import type { CategoryDTO } from '@/lib/menu-types';

const COLUMNS: TableColumn[] = [
  { label: 'Name' },
  { label: 'Slug' },
  { label: 'Actions', srOnly: true, className: 'w-24' },
];

interface CategoryTableProps {
  categories: CategoryDTO[];
  /** Highlights the row currently open in the form. */
  editingId?: string;
  onEdit: (category: CategoryDTO) => void;
  onDeleted: (id: string) => void;
}

export function CategoryTable({ categories, editingId, onEdit, onDeleted }: CategoryTableProps) {
  const deleteMutation = useDeleteCategory({ onSuccess: onDeleted });

  return (
    <TableCard
      title="Categories"
      columns={COLUMNS}
      isEmpty={categories.length === 0}
      emptyText="No categories yet. Add your first one above."
    >
      {categories.map((c) => (
        <TableRow key={c.id} className={c.id === editingId ? 'bg-muted/50' : undefined}>
          <TableCell className="font-medium">{c.name}</TableCell>
          <TableCell className="text-muted-foreground">{c.slug}</TableCell>
          <TableCell>
            <RowActions
              name={c.name}
              disabled={deleteMutation.isPending && deleteMutation.variables === c.id}
              onEdit={() => onEdit(c)}
              onDelete={() => deleteMutation.mutate(c.id)}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableCard>
  );
}
