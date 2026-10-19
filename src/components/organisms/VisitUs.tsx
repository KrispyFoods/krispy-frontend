import { ButtonLink } from '@/components/atoms';
import { InfoBlock } from '@/components/molecules';
import type { Contact, Site } from '@/lib/db';

export function VisitUs({ site, contact }: { site: Site; contact: Contact }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
      <div className="space-y-6 text-muted-foreground">
        <InfoBlock heading="Address">
          <p>{site.address.full}</p>
        </InfoBlock>
        <InfoBlock heading="Hours">
          {site.hours.map((h) => (
            <p key={h.days}>
              {h.days} · {h.time}
            </p>
          ))}
        </InfoBlock>
        <InfoBlock heading="Contact">
          <p>
            <a href={site.phone.href} className="hover:text-primary">
              {site.phone.display}
            </a>
          </p>
          <p>{site.email}</p>
        </InfoBlock>
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href={site.phone.href}>{contact.callLabel}</ButtonLink>
          <ButtonLink href={contact.directionsHref} variant="outline">
            {contact.directionsLabel}
          </ButtonLink>
        </div>
      </div>
      <iframe
        title={contact.mapTitle}
        loading="lazy"
        className="h-80 w-full border border-border md:h-full md:min-h-80"
        src={contact.mapSrc}
      />
    </div>
  );
}
