import { Button } from '@/components/atoms';
import { getNotFound, getSite } from '@/lib/db';

export default async function NotFound() {
  const [content, site] = await Promise.all([getNotFound(), getSite()]);

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 pt-24 text-center">
      <div className="max-w-md">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">{content.eyebrow}</p>
        <h1 className="mt-4 text-7xl font-bold tracking-tight text-foreground md:text-9xl">
          4<span className="text-fire italic">0</span>4
        </h1>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-wider text-foreground">
          {content.heading}
        </h2>
        <p className="mt-3 text-muted-foreground">{content.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/">{content.homeLabel}</Button>
          <Button href={site.phone.href} variant="outline">
            {content.callLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
