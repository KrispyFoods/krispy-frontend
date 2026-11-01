import Image from 'next/image';
import { Price } from '@/components/atoms';
import { Card, CardContent } from '@/components/ui';
import type { Dish } from '@/lib/db';

export function DishCard({ image, name, desc, price }: Dish) {
  return (
    <Card className="group gap-0 rounded-none border border-border py-0 ring-0 *:[img:first-child]:rounded-none">
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="aspect-square w-full bg-muted" />
      )}
      <CardContent className="flex items-baseline justify-between gap-4 p-5">
        <div>
          <h3 className="text-2xl">{name}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        <Price amount={price} />
      </CardContent>
    </Card>
  );
}
