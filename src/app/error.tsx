'use client';

import { useEffect } from 'react';
import { Button } from '@/components/atoms';

// Error boundaries are client components and can't await db.json, so this copy lives here.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 pt-24 text-center">
      <div className="max-w-md">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Kitchen trouble!
        </h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t load this page right now. You can try refreshing the page or head back to the main
          menu.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => reset()}
            className="bg-fire px-8 py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            Try again
          </button>
          <Button href="/" variant="outline">
            Go home
          </Button>
        </div>
      </div>
    </section>
  );
}
