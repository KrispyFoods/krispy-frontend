import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LogoutButton, PageHeader, SectionHeading } from '@/components/molecules';
import { CategoryManager, DishManager } from '@/components/organisms';
import { Skeleton } from '@/components/ui';
import { verifySession } from '@/lib/auth/session';
import { getCategories, getDishes } from '@/lib/menu-data';

export const metadata: Metadata = {
  title: 'Admin | Krispi',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  // The session cookie is read per request, so everything that needs it streams in behind Suspense.
  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Admin" />
      <Suspense fallback={<Skeleton className="mx-auto h-96 w-full max-w-3xl rounded-xl" />}>
        <AdminContent />
      </Suspense>
    </>
  );
}

async function AdminContent() {
  // The proxy only checked the cookie; this also checks the sign-out blocklist.
  if (!(await verifySession())) redirect('/admin/login');

  // Always load on the server first; the managers hand this to useQuery as initialData.
  const [categories, dishes] = await Promise.all([getCategories(), getDishes()]);

  // useQuery reads Date.now() when given initialData, so the managers render at request time
  // behind Suspense instead of being frozen into the prerendered shell.
  return (
    <div className="mx-auto max-w-3xl space-y-16 px-6 pb-24">
      <div className="flex justify-end">
        <LogoutButton />
      </div>

      <section>
        <SectionHeading>Categories</SectionHeading>
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          <CategoryManager initialCategories={categories} />
        </Suspense>
      </section>

      <section>
        <SectionHeading>Dishes</SectionHeading>
        <Suspense fallback={<Skeleton className="h-[48rem] w-full rounded-xl" />}>
          <DishManager initialDishes={dishes} initialCategories={categories} />
        </Suspense>
      </section>
    </div>
  );
}
