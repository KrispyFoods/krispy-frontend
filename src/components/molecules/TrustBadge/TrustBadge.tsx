import { Award, Newspaper, Star } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { TrustBadgeData } from '@/lib/db';

const icons = { award: Award, star: Star, newspaper: Newspaper } as const;

export function TrustBadge({ icon, label }: TrustBadgeData) {
  const Icon = icons[icon];
  return (
    <Badge
      variant="outline"
      className="h-auto gap-2 rounded-none border-none bg-transparent p-0 text-sm tracking-widest text-muted-foreground uppercase"
    >
      <Icon className="size-5 text-primary" />
      {label}
    </Badge>
  );
}
