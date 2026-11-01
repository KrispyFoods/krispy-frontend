'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Eyebrow } from '@/components/atoms';
import {
  Button,
  buttonVariants,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui';

// Error boundaries are client components and can't await db.json, so this copy lives here.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Empty className="min-h-[80vh] px-6 pt-24">
      <EmptyHeader className="max-w-md">
        <Eyebrow className="tracking-[0.4em]">Something went wrong</Eyebrow>
        <EmptyTitle className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Kitchen trouble!
        </EmptyTitle>
        <EmptyDescription>
          We couldn&apos;t load this page right now. You can try refreshing the page or head back to the main
          menu.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-col sm:flex-row sm:justify-center">
        <Button variant="fire" size="cta" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/" className={buttonVariants({ variant: 'fire-outline', size: 'cta' })}>
          Go home
        </Link>
      </EmptyContent>
    </Empty>
  );
}
