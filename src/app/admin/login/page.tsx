import type { Metadata } from 'next';
import { PageHeader } from '@/components/molecules';
import { LoginForm } from '@/components/organisms';

export const metadata: Metadata = {
  title: 'Sign in | Krispi',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <PageHeader eyebrow="Admin" title="Sign in" />
      <div className="mx-auto max-w-md px-6 pb-24">
        <LoginForm />
      </div>
    </>
  );
}
