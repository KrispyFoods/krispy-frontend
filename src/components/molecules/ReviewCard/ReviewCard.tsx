import { StarRating } from '@/components/atoms';
import { Card } from '@/components/ui';
import type { Review } from '@/lib/db';

export function ReviewCard({ name, text }: Review) {
  return (
    <Card className="gap-0 rounded-none border border-border bg-background p-6 ring-0">
      <figure>
        <StarRating />
        <blockquote className="mt-4 text-muted-foreground">&ldquo;{text}&rdquo;</blockquote>
        <figcaption className="mt-4 font-display text-xl">{name}</figcaption>
      </figure>
    </Card>
  );
}
