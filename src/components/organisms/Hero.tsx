import Image from 'next/image';
import { ButtonLink, Eyebrow } from '@/components/atoms';
import type { Home } from '@/lib/db';

export function Hero({ hero, phoneHref }: { hero: Home['hero']; phoneHref: string }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-fade" />
      <div className="relative px-6 pt-20 text-center">
        <Eyebrow className="tracking-[0.4em]">{hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-6xl leading-none md:text-8xl">
          {hero.titleStart} <span className="text-fire italic">{hero.titleHighlight}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{hero.subtitle}</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href={phoneHref}>{hero.primaryCtaLabel}</ButtonLink>
          <ButtonLink href={hero.secondaryCta.href} variant="outline">
            {hero.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
