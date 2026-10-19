import { cn } from '@/lib/cn';

export function Price({ amount, className }: { amount: string; className?: string }) {
  return (
    <span className={cn('whitespace-nowrap font-display text-2xl text-primary', className)}>Rs {amount}</span>
  );
}
