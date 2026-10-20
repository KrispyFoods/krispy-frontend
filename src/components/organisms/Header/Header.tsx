'use client';

import { Menu as MenuIcon, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button, Logo } from '@/components/atoms';
import { NavLink } from '@/components/molecules';
import type { Nav } from '@/lib/db';

export function Header({ name, nav }: { name: string; nav: Nav }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo name={name} />
        <nav className="hidden items-center gap-6 text-sm uppercase tracking-widest md:flex">
          {nav.links.map((n) => (
            <NavLink key={n.href} href={n.href} label={n.label} active={pathname === n.href} />
          ))}
          <Button href={nav.cta.href} size="sm">
            {nav.cta.label}
          </Button>
        </nav>
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border bg-background px-6 py-6 text-sm uppercase tracking-widest md:hidden">
          {nav.links.map((n) => (
            <NavLink
              key={n.href}
              href={n.href}
              label={n.label}
              active={pathname === n.href}
              variant="mobile"
              onClick={() => setOpen(false)}
            />
          ))}
          <Button href={nav.cta.href} className="text-center" onClick={() => setOpen(false)}>
            {nav.cta.label}
          </Button>
        </nav>
      )}
    </header>
  );
}
