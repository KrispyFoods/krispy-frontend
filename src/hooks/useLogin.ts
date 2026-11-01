'use client';

import { useRouter } from 'next/navigation';
import { useActionMutation } from '@/hooks/useActionMutation';
import { login } from '@/lib/actions/auth';

/** Signs the admin in with a PIN, then opens the admin page (the proxy now lets it through). */
export function useLogin({
  onFieldErrors,
}: {
  onFieldErrors?: (fieldErrors: Record<string, string>) => void;
}) {
  const router = useRouter();

  return useActionMutation({
    action: (pin: string) => login({ pin }),
    onFieldErrors,
    onSuccess: () => {
      router.replace('/admin');
      router.refresh();
    },
  });
}
