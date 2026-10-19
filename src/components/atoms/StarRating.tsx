import { Star } from 'lucide-react';

export function StarRating({ count = 5 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="flex gap-1 text-primary" role="img" aria-label={`${count} out of 5 stars`}>
      {stars.map((n) => (
        <Star key={`star-${n}`} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}
