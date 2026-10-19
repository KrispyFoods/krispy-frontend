import { PageHeader } from '@/components/molecules';
import { VisitUs } from '@/components/organisms';
import { getContact, getSite } from '@/lib/db';

export async function ContactPage() {
  const [site, contact] = await Promise.all([getSite(), getContact()]);

  return (
    <>
      <PageHeader eyebrow={contact.header.eyebrow} title={contact.header.title} />
      <div className="pb-24">
        <VisitUs site={site} contact={contact} />
      </div>
    </>
  );
}
