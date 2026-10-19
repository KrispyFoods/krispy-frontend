import type { Metadata } from 'next';
import { getPageMeta, type PageKey } from '@/lib/db';

/** Build a page's Next.js metadata from its entry in db.json. */
export async function pageMetadata(page: PageKey): Promise<Metadata> {
  const meta = await getPageMeta(page);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.ogTitle, description: meta.ogDescription },
  };
}
