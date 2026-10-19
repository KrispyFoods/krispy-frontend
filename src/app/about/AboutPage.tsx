import Image from 'next/image';
import { PageHeader } from '@/components/molecules';
import { getAbout } from '@/lib/db';

export async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <PageHeader eyebrow={about.header.eyebrow} title={about.header.title} />
      <div className="mx-auto max-w-4xl px-6 pb-24">
        <Image
          src={about.image.src}
          alt={about.image.alt}
          width={about.image.width}
          height={about.image.height}
          className="w-full object-cover"
        />
        <div className="mx-auto mt-12 max-w-2xl space-y-6 text-lg text-muted-foreground">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </>
  );
}
