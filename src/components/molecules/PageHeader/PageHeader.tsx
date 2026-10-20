import { Eyebrow } from '@/components/atoms';

export function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="px-6 pb-12 pt-32 text-center md:pt-36">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 text-5xl md:text-7xl">{title}</h1>
    </section>
  );
}
