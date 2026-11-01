import Link from 'next/link';
import { Eyebrow } from '@/components/atoms';
import {
  buttonVariants,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui';
import { getNotFound, getSite } from '@/lib/db';

export default async function NotFound() {
  const [content, site] = await Promise.all([getNotFound(), getSite()]);

  return (
    <Empty className="min-h-[80vh] px-6 pt-24">
      <EmptyHeader className="max-w-md">
        <Eyebrow className="tracking-[0.4em]">{content.eyebrow}</Eyebrow>
        <EmptyTitle className="font-display text-7xl font-bold tracking-tight text-foreground md:text-9xl">
          4<span className="text-fire italic">0</span>4
        </EmptyTitle>
        <h2 className="text-2xl font-semibold uppercase tracking-wider text-foreground">{content.heading}</h2>
        <EmptyDescription>{content.text}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-col sm:flex-row sm:justify-center">
        <Link href="/" className={buttonVariants({ variant: 'fire', size: 'cta' })}>
          {content.homeLabel}
        </Link>
        <Link href={site.phone.href} className={buttonVariants({ variant: 'fire-outline', size: 'cta' })}>
          {content.callLabel}
        </Link>
      </EmptyContent>
    </Empty>
  );
}
