import { Button } from '@/components/atoms';
import { MenuItem } from '@/components/molecules';
import type { Menu } from '@/lib/db';

export function MenuSections({ menu, phoneHref }: { menu: Menu; phoneHref: string }) {
  return (
    <div className="mx-auto max-w-3xl space-y-16 px-6 pb-24">
      {menu.sections.map((s) => (
        <section key={s.section}>
          <h2 className="mb-8 border-b border-border pb-3 text-4xl text-primary">{s.section}</h2>
          <ul className="space-y-6">
            {s.items.map((item) => (
              <MenuItem key={item.name} {...item} />
            ))}
          </ul>
        </section>
      ))}
      <div className="text-center">
        <Button href={phoneHref} className="inline-block">
          {menu.cta}
        </Button>
      </div>
    </div>
  );
}
