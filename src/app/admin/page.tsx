import type { Metadata } from 'next';
import { MenuItem, PageHeader } from '@/components/molecules';
import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { getMenu } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Admin | Krispy',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const menu = await getMenu();
  const sections = menu.sections.map((s) => ({ label: s.section, value: s.section }));
  const itemCount = menu.sections.reduce((total, s) => total + s.items.length, 0);

  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Admin" />

      <div className="mx-auto max-w-3xl space-y-16 px-6 pb-24">
        <dl className="grid grid-cols-2 gap-4">
          {[
            { label: 'Menu sections', value: menu.sections.length },
            { label: 'Menu items', value: itemCount },
          ].map((stat) => (
            <div key={stat.label} className="border border-border bg-card p-6">
              <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 text-4xl text-primary">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <section>
          <h2 className="mb-8 border-b border-border pb-3 text-4xl text-primary">Add menu item</h2>
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="sr-only">New menu item</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="item-section">Section</FieldLabel>
                    <Select name="section" items={sections} defaultValue={sections[0]?.value}>
                      <SelectTrigger id="item-section">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sections.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="item-name">Name</FieldLabel>
                      <Input id="item-name" name="name" placeholder="Crispy Chicken Burger" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="item-price">Price</FieldLabel>
                      <Input id="item-price" name="price" placeholder="1,200" required />
                      <FieldDescription>Shown as Rs.</FieldDescription>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="item-desc">Description</FieldLabel>
                    <Textarea
                      id="item-desc"
                      name="desc"
                      placeholder="Hand-breaded fillet, slaw and house sauce"
                      className="resize-none"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Field orientation="horizontal">
                <Button type="submit">Add item</Button>
                <Button variant="outline" type="reset">
                  Clear
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </section>

        <section>
          <h2 className="mb-8 border-b border-border pb-3 text-4xl text-primary">Current menu</h2>
          <div className="space-y-12">
            {menu.sections.map((s) => (
              <div key={s.section}>
                <h3 className="mb-6 text-2xl text-foreground">{s.section}</h3>
                <ul className="space-y-6">
                  {s.items.map((item) => (
                    <MenuItem key={item.name} {...item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
