import type { ReactNode } from 'react';

/** A small headed block of text, e.g. Address / Hours / Contact on the Visit Us section. */
export function InfoBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-2xl text-foreground">{heading}</h3>
      {children}
    </div>
  );
}
