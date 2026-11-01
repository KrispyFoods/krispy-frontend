import { cn } from '@/lib/utils';

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-xs uppercase tracking-[0.3em] text-primary', className)}>{children}</p>;
}
