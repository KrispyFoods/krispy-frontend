'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useActionMutation } from '@/hooks/useActionMutation';
import { logout } from '@/lib/actions/auth';

/** Signs the admin out: the server blocklists the token and drops the cookie, then we leave /admin. */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useActionMutation({
    action: (_: void) => logout(),
    successMessage: 'Signed out.',
    onSuccess: () => {
      queryClient.clear(); // don't keep admin data around in the browser
      router.replace('/admin/login');
      router.refresh();
    },
  });
}
