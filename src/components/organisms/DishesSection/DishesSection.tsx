import Link from 'next/link';
import { DishCard, SectionTitle } from '@/components/molecules';
import type { Home } from '@/lib/db';

export function DishesSection({ dishes }: { dishes: Home['dishes'] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <SectionTitle eyebrow={dishes.eyebrow} title={dishes.title} />
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {dishes.items.map((d) => (
          <DishCard key={d.name} {...d} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href={dishes.link.href}
          className="text-sm uppercase tracking-widest text-primary hover:underline"
        >
          {dishes.link.label}
        </Link>
      </div>
    </section>
  );
}
