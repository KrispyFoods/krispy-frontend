'use client';

import { Pencil } from 'lucide-react';
import { ConfirmDelete } from '@/components/molecules/ConfirmDelete';
import { Button } from '@/components/ui';

interface RowActionsProps {
  /** Name of the row's item, used for the accessible button names and the delete dialog. */
  name: string;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

/** Edit + Delete buttons for a table row. */
export function RowActions({ name, onEdit, onDelete, disabled }: RowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Edit ${name}`}
        disabled={disabled}
        onClick={onEdit}
      >
        <Pencil />
      </Button>
      <ConfirmDelete name={name} disabled={disabled} onConfirm={onDelete} />
    </div>
  );
}
