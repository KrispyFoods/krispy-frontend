import { OfferCard, SectionTitle } from '@/components/molecules';
import type { Home } from '@/lib/db';

export function OffersSection({ offers }: { offers: Home['offers'] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle eyebrow={offers.eyebrow} title={offers.title} />
      <div className="grid gap-6 md:grid-cols-3">
        {offers.items.map((o) => (
          <OfferCard key={o.title} {...o} />
        ))}
      </div>
    </section>
  );
}
