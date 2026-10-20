import { Price } from '@/components/atoms';
import type { MenuItemData } from '@/lib/db';

export function MenuItem({ name, desc, price }: MenuItemData) {
  return (
    <li className="flex items-baseline gap-4">
      <div className="flex-1">
        <h3 className="text-2xl">{name}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Price amount={price} />
    </li>
  );
}
