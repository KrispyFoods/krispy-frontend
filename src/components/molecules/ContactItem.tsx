import type { ReactNode } from 'react';

/** Footer contact row: an icon next to a line of text or a link. */
export function ContactItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-primary">{icon}</span>
      {children}
    </li>
  );
}
