import { StarRating } from '@/components/atoms';
import type { Review } from '@/lib/db';

export function ReviewCard({ name, text }: Review) {
  return (
    <figure className="border border-border bg-background p-6">
      <StarRating />
      <blockquote className="mt-4 text-muted-foreground">&ldquo;{text}&rdquo;</blockquote>
      <figcaption className="mt-4 font-display text-xl">{name}</figcaption>
    </figure>
  );
}
