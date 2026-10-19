import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline';

const base = 'text-sm font-semibold uppercase tracking-widest';
const sizes = { md: 'px-8 py-3', sm: 'px-5 py-2' } as const;
const variants: Record<Variant, string> = {
  primary: 'bg-fire text-primary-foreground shadow-glow transition-transform hover:scale-105',
  outline: 'border border-border transition-colors hover:border-primary hover:text-primary',
};

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

/** A link styled as a button. Site paths use next/link; tel:, mailto: and http(s) links use a plain <a>. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  children,
}: ButtonLinkProps) {
  const classes = cn(base, sizes[size], variants[variant], className);

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const isWeb = href.startsWith('http');
  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      {...(isWeb ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
