import Image from 'next/image';
import { SectionTitle } from '@/components/molecules';
import type { Home } from '@/lib/db';

export function GallerySection({ gallery }: { gallery: Home['gallery'] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <SectionTitle eyebrow={gallery.eyebrow} title={gallery.title} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {gallery.images.map((g) => (
          <Image
            key={g.src}
            src={g.src}
            alt={gallery.alt}
            width={500}
            height={500}
            className="aspect-square w-full object-cover"
          />
        ))}
      </div>
    </section>
  );
}
