import { Percent } from 'lucide-react';
import type { Offer } from '@/lib/db';

export function OfferCard({ title, text, tag }: Offer) {
  return (
    <div className="relative border border-primary/40 bg-card p-6">
      <span className="absolute right-4 top-4 flex items-center gap-1 bg-fire px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
        <Percent className="h-3 w-3" />
        {tag}
      </span>
      <h3 className="text-3xl">{title}</h3>
      <p className="mt-2 text-muted-foreground">{text}</p>
    </div>
  );
}
