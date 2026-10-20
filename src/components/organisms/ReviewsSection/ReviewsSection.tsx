import { ReviewCard, SectionTitle, TrustBadge } from '@/components/molecules';
import type { Home } from '@/lib/db';

export function ReviewsSection({ reviews }: { reviews: Home['reviews'] }) {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow={reviews.eyebrow} title={reviews.title} />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.items.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm uppercase tracking-widest text-muted-foreground">
          {reviews.badges.map((b) => (
            <TrustBadge key={b.label} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}
