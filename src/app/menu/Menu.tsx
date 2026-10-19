import { PageHeader } from '@/components/molecules';
import { MenuSections } from '@/components/organisms';
import { getMenu, getSite } from '@/lib/db';

export async function MenuPage() {
  const [menu, site] = await Promise.all([getMenu(), getSite()]);

  return (
    <>
      <PageHeader eyebrow={menu.header.eyebrow} title={menu.header.title} />
      <MenuSections menu={menu} phoneHref={site.phone.href} />
    </>
  );
}
