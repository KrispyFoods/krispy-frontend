import Link from 'next/link';
import { Price } from '@/components/atoms';
import { SectionHeading } from '@/components/molecules';
import {
  buttonVariants,
  Empty,
  EmptyDescription,
  EmptyHeader,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui';
import type { Menu } from '@/lib/db';

export function MenuSections({ menu, phoneHref }: { menu: Menu; phoneHref: string }) {
  return (
    <div className="mx-auto max-w-3xl space-y-16 px-6 pb-24">
      {menu.sections.length === 0 && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyDescription>{menu.empty}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {menu.sections.map((s) => (
        <section key={s.section}>
          <SectionHeading>{s.section}</SectionHeading>
          <ItemGroup className="gap-6">
            {s.items.map((item) => (
              <Item key={item.name} className="items-baseline p-0">
                <ItemContent>
                  <ItemTitle className="font-display text-2xl">{item.name}</ItemTitle>
                  <ItemDescription>{item.desc}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Price amount={item.price} />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </section>
      ))}
      <div className="text-center">
        <Link href={phoneHref} className={buttonVariants({ variant: 'fire', size: 'cta' })}>
          {menu.cta}
        </Link>
      </div>
    </div>
  );
}
