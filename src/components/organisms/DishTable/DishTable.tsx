'use client';

import Image from 'next/image';
import { RowActions, TableCard, type TableColumn } from '@/components/molecules';
import { Badge, TableCell, TableRow } from '@/components/ui';
import { useDeleteDish } from '@/hooks/useDeleteDish';
import { formatPrice } from '@/lib/format';
import type { CategoryDTO, DishDTO } from '@/lib/menu-types';

const COLUMNS: TableColumn[] = [
  { label: 'Photo', className: 'w-14' },
  { label: 'Name' },
  { label: 'Category' },
  { label: 'Price', className: 'text-right' },
  { label: 'Status' },
  { label: 'Actions', srOnly: true, className: 'w-24' },
];

interface DishTableProps {
  dishes: DishDTO[];
  categories: CategoryDTO[];
  /** Highlights the row currently open in the form. */
  editingId?: string;
  onEdit: (dish: DishDTO) => void;
  onDeleted: (id: string) => void;
}

export function DishTable({ dishes, categories, editingId, onEdit, onDeleted }: DishTableProps) {
  const categoryNames = new Map(categories.map((c) => [c.id, c.name]));
  const deleteMutation = useDeleteDish({ onSuccess: onDeleted });

  return (
    <TableCard
      title="Dishes"
      columns={COLUMNS}
      isEmpty={dishes.length === 0}
      emptyText="No dishes yet. Add your first one above."
    >
      {dishes.map((d) => (
        <TableRow key={d.id} className={d.id === editingId ? 'bg-muted/50' : undefined}>
          <TableCell>
            {d.image ? (
              <Image
                src={d.image}
                alt={d.name}
                width={40}
                height={40}
                className="size-10 rounded-md object-cover"
              />
            ) : (
              <div className="size-10 rounded-md bg-muted" />
            )}
          </TableCell>
          <TableCell className="font-medium">{d.name}</TableCell>
          <TableCell className="text-muted-foreground">{categoryNames.get(d.categoryId) ?? '—'}</TableCell>
          <TableCell className="text-right">{formatPrice(d.price)}</TableCell>
          <TableCell className="space-x-1">
            <Badge variant={d.isAvailable ? 'default' : 'secondary'}>
              {d.isAvailable ? 'Available' : 'Hidden'}
            </Badge>
            {d.isFeatured && <Badge variant="outline">Featured</Badge>}
          </TableCell>
          <TableCell>
            <RowActions
              name={d.name}
              disabled={deleteMutation.isPending && deleteMutation.variables === d.id}
              onEdit={() => onEdit(d)}
              onDelete={() => deleteMutation.mutate(d.id)}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableCard>
  );
}
