import { Eyebrow } from '@/components/atoms';

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-4xl md:text-5xl">{title}</h2>
    </div>
  );
}
