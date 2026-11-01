'use client';

import { type ReactNode, type SubmitEvent, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Spinner,
} from '@/components/ui';

interface FormCardProps {
  title: string;
  description?: string;
  submitLabel: string;
  pendingLabel: string;
  pending?: boolean;
  /** Disables Submit without showing the pending state (e.g. while a photo is uploading). */
  submitDisabled?: boolean;
  onSubmit: () => void;
  /** Runs when the Clear button resets the form (create mode). */
  onClear: () => void;
  /** Given in edit mode: shows Cancel instead of Clear and scrolls the form into view. */
  onCancel?: () => void;
  children: ReactNode;
}

/** Card + form with the Submit / Clear (or Cancel) footer every admin form shares. */
export function FormCard({
  title,
  description,
  submitLabel,
  pendingLabel,
  pending = false,
  submitDisabled = false,
  onSubmit,
  onClear,
  onCancel,
  children,
}: FormCardProps) {
  const ref = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(onCancel);

  // Opening a row for editing remounts the form; bring it into view.
  useEffect(() => {
    if (isEdit) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isEdit]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <form ref={ref} onSubmit={handleSubmit} onReset={onClear} noValidate className="scroll-mt-28">
        <CardContent>{children}</CardContent>
        <CardFooter className="gap-3">
          <Button type="submit" disabled={pending || submitDisabled}>
            {pending && <Spinner />}
            {pending ? pendingLabel : submitLabel}
          </Button>
          {onCancel ? (
            <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>
              Cancel
            </Button>
          ) : (
            <Button type="reset" variant="outline" disabled={pending}>
              Clear
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
