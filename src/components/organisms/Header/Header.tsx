'use client';

import { Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/atoms';
import {
  Button,
  buttonVariants,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import type { Nav } from '@/lib/db';
import { cn } from '@/lib/utils';

export function Header({ nav }: { nav: Nav }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        <div className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              {nav.links.map((n) => (
                <NavigationMenuItem key={n.href}>
                  <NavigationMenuLink
                    active={pathname === n.href}
                    render={<Link href={n.href} />}
                    className="p-0 text-sm tracking-widest text-muted-foreground uppercase hover:bg-transparent hover:text-primary focus:bg-transparent data-active:bg-transparent data-active:font-semibold data-active:text-primary data-active:hover:bg-transparent data-active:focus:bg-transparent"
                  >
                    {n.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Link href={nav.cta.href} className={buttonVariants({ variant: 'fire', size: 'cta-sm' })}>
            {nav.cta.label}
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 px-4 text-sm tracking-widest uppercase">
              {nav.links.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === n.href ? 'page' : undefined}
                  className={cn(pathname === n.href ? 'font-semibold text-primary' : 'text-muted-foreground')}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href={nav.cta.href}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: 'fire', size: 'cta' }), 'text-center')}
              >
                {nav.cta.label}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
