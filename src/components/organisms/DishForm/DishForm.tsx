'use client';

import { useState } from 'react';
import { FormCard, ImageUploadField } from '@/components/molecules';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@/components/ui';
import { useCreateDish } from '@/hooks/useCreateDish';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useUpdateDish } from '@/hooks/useUpdateDish';
import type { CategoryDTO, DishDTO } from '@/lib/menu-types';
import { dishSchema, toFieldErrors } from '@/lib/schemas';

interface DishFormProps {
  /** The dish being edited, or null to add a new one. The parent remounts the form when it changes. */
  editing: DishDTO | null;
  categories: CategoryDTO[];
  /** Called after a successful save and when editing is cancelled. */
  onDone: () => void;
}

export function DishForm({ editing, categories, onDone }: DishFormProps) {
  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [categoryId, setCategoryId] = useState<string | null>(editing?.categoryId ?? null);
  const [isAvailable, setIsAvailable] = useState(editing?.isAvailable ?? true);
  const [isFeatured, setIsFeatured] = useState(editing?.isFeatured ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const image = useImageUpload(
    editing?.image && editing.imagePublicId ? { url: editing.image, publicId: editing.imagePublicId } : null,
  );

  const resetFields = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId(null);
    setIsAvailable(true);
    setIsFeatured(false);
    setErrors({});
  };

  const handleSaved = () => {
    image.release(); // the photo now belongs to the dish, don't delete it on the way out
    resetFields();
    onDone();
  };

  const create = useCreateDish({ onSuccess: handleSaved, onFieldErrors: setErrors });
  const update = useUpdateDish({ onSuccess: handleSaved, onFieldErrors: setErrors });
  const saving = create.isPending || update.isPending;
  const categoryItems = categories.map((c) => ({ label: c.name, value: c.id }));

  const handleSubmit = () => {
    if (image.status === 'error') {
      setErrors({ image: 'Try the photo again or remove it.' });
      return;
    }
    const parsed = dishSchema.safeParse({
      name,
      description,
      price: price.trim() === '' ? Number.NaN : Number(price),
      categoryId: categoryId ?? '',
      imagePublicId: image.publicId,
      isAvailable,
      isFeatured,
    });
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    if (editing) update.mutate({ id: editing.id, input: parsed.data });
    else create.mutate(parsed.data);
  };

  const handleClear = () => {
    image.reset();
    resetFields();
  };

  return (
    <FormCard
      title={editing ? 'Edit dish' : 'Add dish'}
      description="New dishes show up on the menu once they are saved."
      submitLabel={editing ? 'Save changes' : 'Add dish'}
      pendingLabel={editing ? 'Saving...' : 'Adding...'}
      pending={saving}
      submitDisabled={image.busy}
      onSubmit={handleSubmit}
      onClear={handleClear}
      onCancel={editing ? onDone : undefined}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="dish-name">Name</FieldLabel>
          <Input
            id="dish-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="Crispy Chicken Burger"
            disabled={saving}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor="dish-description">Description</FieldLabel>
          <Textarea
            id="dish-description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Hand-breaded fillet, slaw and house sauce"
            className="resize-none"
            disabled={saving}
          />
          <FieldError>{errors.description}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.price)}>
            <FieldLabel htmlFor="dish-price">Price (Rs)</FieldLabel>
            <Input
              id="dish-price"
              name="price"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1200"
              disabled={saving}
              aria-invalid={Boolean(errors.price)}
            />
            <FieldError>{errors.price}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.categoryId)}>
            <FieldLabel htmlFor="dish-category">Category</FieldLabel>
            <Select
              name="category"
              items={categoryItems}
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={categories.length === 0 || saving}
            >
              <SelectTrigger id="dish-category" aria-invalid={Boolean(errors.categoryId)}>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoryItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {categories.length === 0 && <FieldDescription>Add a category first.</FieldDescription>}
            <FieldError>{errors.categoryId}</FieldError>
          </Field>
        </div>

        <ImageUploadField
          id="dish-image"
          label="Photo"
          file={image.file}
          existingUrl={image.existingUrl}
          status={image.status}
          error={image.status === 'error' ? image.error : errors.image}
          onSelect={(file) => void image.select(file)}
          onRemove={image.remove}
          onRetry={image.retry}
          disabled={saving}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field orientation="horizontal">
            <Switch
              id="dish-available"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
              disabled={saving}
            />
            <FieldLabel htmlFor="dish-available" className="font-normal">
              Show on the menu
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="dish-featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
              disabled={saving}
            />
            <FieldLabel htmlFor="dish-featured" className="font-normal">
              Feature on the home page
            </FieldLabel>
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
