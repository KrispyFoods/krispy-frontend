import Link from 'next/link';
import { cn } from '@/lib/cn';

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  variant?: 'desktop' | 'mobile';
  onClick?: () => void;
}

export function NavLink({ href, label, active, variant = 'desktop', onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        active ? 'font-semibold text-primary' : 'text-muted-foreground',
        variant === 'desktop' && 'transition-colors hover:text-primary',
      )}
    >
      {label}
    </Link>
  );
}
