import type { ReactNode } from 'react';

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-8 border-b border-border pb-3 text-4xl text-primary">{children}</h2>;
}
