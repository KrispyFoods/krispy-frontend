'use client';

import { CircleCheck, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { type DragEvent, useEffect, useRef, useState } from 'react';
import {
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldError,
  FieldLabel,
  Spinner,
} from '@/components/ui';
import { formatBytes } from '@/lib/image';
import { IMAGE_TYPES } from '@/lib/image-constants';
import type { UploadStatus } from '@/lib/menu-types';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  id: string;
  label: string;
  /** The newly picked file (name and size); null shows the saved photo or the empty dropzone. */
  file: File | null;
  /** The photo already saved with the dish, shown while no new file is picked. */
  existingUrl?: string;
  status: UploadStatus;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onRetry: () => void;
  disabled?: boolean;
}

const STATUS_TEXT: Partial<Record<UploadStatus, string>> = {
  processing: 'Optimising photo...',
  uploading: 'Uploading...',
  uploaded: 'Uploaded',
};

// shadcn has no image uploader, so this is composed from its Field, Empty, Button and Spinner.
export function ImageUploadField({
  id,
  label,
  file,
  existingUrl,
  status,
  error,
  onSelect,
  onRemove,
  onRetry,
  disabled,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const busy = status === 'processing' || status === 'uploading';

  // Blob URLs are created in handlers (not an effect) and revoked when replaced, cleared or on unmount.
  const replacePreview = (next: File | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setPreview(previewRef.current);
  };

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  // The parent cleared the file (form reset): release the blob and reset the native input.
  useEffect(() => {
    if (file) return;
    if (inputRef.current) inputRef.current.value = '';
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
  }, [file]);

  const pick = (picked: File | undefined) => {
    if (!picked || disabled || busy) return;
    replacePreview(picked);
    onSelect(picked);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  const src = file && preview ? preview : (existingUrl ?? null);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        disabled={disabled || busy}
        className="peer sr-only"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {src ? (
        <div className="space-y-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={src}
              alt={file ? 'Selected photo preview' : 'Current photo'}
              fill
              unoptimized
              sizes="(min-width: 768px) 28rem, 100vw"
              className="object-cover"
            />
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Spinner className="size-6" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm">{file ? file.name : 'Current photo'}</p>
              {file && <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || busy}
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={disabled || busy} onClick={onRemove}>
                Remove
              </Button>
            </div>
          </div>

          <div aria-live="polite" className="flex min-h-5 items-center gap-2 text-sm text-muted-foreground">
            {busy && <Spinner />}
            {status === 'uploaded' && <CircleCheck className="size-4 text-primary" />}
            {STATUS_TEXT[status] && <span>{STATUS_TEXT[status]}</span>}
            {status === 'error' && (
              <Button type="button" variant="outline" size="xs" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'block cursor-pointer rounded-xl transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          <Empty
            className={cn(
              'border border-dashed border-input transition-colors hover:border-primary/60 hover:bg-primary/5',
              dragging && 'border-primary bg-primary/5',
              error && 'border-destructive',
            )}
          >
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImagePlus />
              </EmptyMedia>
              <EmptyTitle>Drag a photo here or click to browse</EmptyTitle>
              <EmptyDescription>JPG, PNG or WebP, up to 10 MB</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </label>
      )}

      <FieldError>{error}</FieldError>
    </Field>
  );
}
