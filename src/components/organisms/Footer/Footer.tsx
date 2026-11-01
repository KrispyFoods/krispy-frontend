import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { CurrentYear, Logo } from '@/components/atoms';
import { SocialLinks } from '@/components/molecules';
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui';
import type { Nav, Site } from '@/lib/db';

export function Footer({ site, nav }: { site: Site; nav: Nav }) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Logo />
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
          <ItemGroup className="mt-3 gap-2">
            {[
              { id: 'address', icon: MapPin, content: site.address.short },
              { id: 'phone', icon: Phone, content: <a href={site.phone.href}>{site.phone.display}</a> },
              { id: 'email', icon: Mail, content: site.email },
            ].map(({ id, icon: Icon, content }) => (
              <Item key={id} size="xs" className="items-start p-0">
                <ItemMedia className="text-primary">
                  <Icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="font-normal text-muted-foreground">{content}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
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
