import { Award, Newspaper, Star } from 'lucide-react';
import type { TrustBadgeData } from '@/lib/db';

const icons = { award: Award, star: Star, newspaper: Newspaper } as const;

export function TrustBadge({ icon, label }: TrustBadgeData) {
  const Icon = icons[icon];
  return (
    <span className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      {label}
    </span>
  );
}
