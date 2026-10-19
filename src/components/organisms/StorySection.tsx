import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/atoms';
import type { Home } from '@/lib/db';

export function StorySection({ story }: { story: Home['story'] }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 md:grid-cols-2">
      <Image
        src={story.image.src}
        alt={story.image.alt}
        width={800}
        height={600}
        className="w-full object-cover"
      />
      <div>
        <Eyebrow>{story.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-5xl">{story.title}</h2>
        <p className="mt-6 text-muted-foreground">{story.text}</p>
        <Link
          href={story.link.href}
          className="mt-8 inline-block text-sm uppercase tracking-widest text-primary hover:underline"
        >
          {story.link.label}
        </Link>
      </div>
    </section>
  );
}
