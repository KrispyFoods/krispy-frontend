import { SocialIcon } from '@/components/atoms';
import type { Site } from '@/lib/db';

export function SocialLinks({ links }: { links: Site['social'] }) {
  return (
    <div className="mt-4 flex gap-4">
      {links.map((l) => (
        <a key={l.id} href={l.href} aria-label={l.label} className="hover:text-primary">
          <SocialIcon id={l.id} />
        </a>
      ))}
    </div>
  );
}
