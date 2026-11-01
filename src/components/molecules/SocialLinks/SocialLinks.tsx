import { SocialIcon } from '@/components/atoms';
import { buttonVariants } from '@/components/ui';
import type { Site } from '@/lib/db';

export function SocialLinks({ links }: { links: Site['social'] }) {
  return (
    <div className="mt-4 flex gap-2">
      {links.map((l) => (
        <a
          key={l.id}
          href={l.href}
          aria-label={l.label}
          className={buttonVariants({ variant: 'ghost', size: 'icon-lg' })}
        >
          <SocialIcon id={l.id} />
        </a>
      ))}
    </div>
  );
}
