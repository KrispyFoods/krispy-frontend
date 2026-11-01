import { Percent } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import type { Offer } from '@/lib/db';

export function OfferCard({ title, text, tag }: Offer) {
  return (
    <Card className="relative gap-0 rounded-none border border-primary/40 p-6 ring-0">
      <Badge className="absolute top-4 right-4 h-auto rounded-none bg-fire px-3 py-1 text-xs font-bold text-primary-foreground uppercase">
        <Percent />
        {tag}
      </Badge>
      <h3 className="text-3xl">{title}</h3>
      <p className="mt-2 text-muted-foreground">{text}</p>
    </Card>
  );
}
