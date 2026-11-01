import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

export function Price({ amount, className }: { amount: number | string; className?: string }) {
  return (
    <span className={cn('whitespace-nowrap font-display text-2xl text-primary', className)}>
      {formatPrice(amount)}
    </span>
  );
}
