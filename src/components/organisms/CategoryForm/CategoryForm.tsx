'use client';

import { useState } from 'react';
import { FormCard } from '@/components/molecules';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, Input } from '@/components/ui';
import { useCreateCategory } from '@/hooks/useCreateCategory';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import type { CategoryDTO } from '@/lib/menu-types';
import { categorySchema, toFieldErrors } from '@/lib/schemas';
import { slugify } from '@/lib/slugify';

interface CategoryFormProps {
  /** The category being edited, or null to add a new one. The parent remounts the form when it changes. */
  editing: CategoryDTO | null;
  /** Called after a successful save and when editing is cancelled. */
  onDone: () => void;
}

export function CategoryForm({ editing, onDone }: CategoryFormProps) {
  const [name, setName] = useState(editing?.name ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClear = () => {
    setName('');
    setErrors({});
  };

  const handleSaved = () => {
    handleClear();
    onDone();
  };

  const create = useCreateCategory({ onSuccess: handleSaved, onFieldErrors: setErrors });
  const update = useUpdateCategory({ onSuccess: handleSaved, onFieldErrors: setErrors });
  const pending = create.isPending || update.isPending;

  const handleSubmit = () => {
    const parsed = categorySchema.safeParse({ name });
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    if (editing) update.mutate({ id: editing.id, input: parsed.data });
    else create.mutate(parsed.data);
  };

  return (
    <FormCard
      title={editing ? 'Edit category' : 'Add category'}
      description="Categories group dishes on the menu, e.g. Burgers or Sides."
      submitLabel={editing ? 'Save changes' : 'Add category'}
      pendingLabel={editing ? 'Saving...' : 'Adding...'}
      pending={pending}
      onSubmit={handleSubmit}
      onClear={handleClear}
      onCancel={editing ? onDone : undefined}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="category-name">Name</FieldLabel>
          <Input
            id="category-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Burgers"
            disabled={pending}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldDescription>Slug: {slugify(name) || '—'}</FieldDescription>
          <FieldError>{errors.name}</FieldError>
        </Field>
      </FieldGroup>
    </FormCard>
  );
}
