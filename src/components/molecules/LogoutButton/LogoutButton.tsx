'use client';

import { Button, Spinner } from '@/components/ui';
import { useLogout } from '@/hooks/useLogout';

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button variant="outline" disabled={logout.isPending} onClick={() => logout.mutate()}>
      {logout.isPending && <Spinner />}
      Sign out
    </Button>
  );
}
