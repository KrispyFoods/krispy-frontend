import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { CurrentYear, Logo } from '@/components/atoms';
import { ContactItem, SocialLinks } from '@/components/molecules';
import type { Nav, Site } from '@/lib/db';

export function Footer({ site, nav }: { site: Site; nav: Nav }) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Logo name={site.name} />
          <p className="mt-3 text-sm text-muted-foreground">{site.tagline}</p>
          <SocialLinks links={site.social} />
        </div>
        <div>
          <h4 className="font-display text-xl">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {nav.links.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-primary">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <ContactItem icon={<MapPin className="h-4 w-4" />}>{site.address.short}</ContactItem>
            <ContactItem icon={<Phone className="h-4 w-4" />}>
              <a href={site.phone.href}>{site.phone.display}</a>
            </ContactItem>
            <ContactItem icon={<Mail className="h-4 w-4" />}>{site.email}</ContactItem>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl">Info</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {site.footerInfo.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © <CurrentYear /> {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
