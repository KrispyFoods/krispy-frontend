'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ActionResult } from '@/lib/menu-types';

const GENERIC_ERROR = 'Something went wrong. Try again.';

/** What a form passes to a create/update hook so it can react to the result. */
export interface SaveOptions<TData> {
  onSuccess?: (data: TData) => void;
  onFieldErrors?: (fieldErrors: Record<string, string>) => void;
}

interface ActionMutationOptions<TVars, TData> {
  action: (vars: TVars) => Promise<ActionResult<TData>>;
  /** Toast shown when the action succeeded. */
  successMessage?: string | ((data: TData) => string);
  /** Runs only when the action succeeded. */
  onSuccess?: (data: TData, vars: TVars) => void;
  /** Runs with the server's per-field messages when the action returned a failure. */
  onFieldErrors?: (fieldErrors: Record<string, string>) => void;
}

/**
 * `useMutation` for server actions that return an `ActionResult`: failures become an error toast
 * (plus field errors for the form) and unexpected throws become a generic toast, in one place.
 */
export function useActionMutation<TVars, TData>({
  action,
  successMessage,
  onSuccess,
  onFieldErrors,
}: ActionMutationOptions<TVars, TData>) {
  return useMutation({
    mutationFn: action,
    onSuccess: (result, vars) => {
      if (!result.ok) {
        onFieldErrors?.(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }
      if (successMessage) {
        toast.success(typeof successMessage === 'function' ? successMessage(result.data) : successMessage);
      }
      onSuccess?.(result.data, vars);
    },
    onError: () => toast.error(GENERIC_ERROR),
  });
}
