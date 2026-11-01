'use server';

import { fail, ok, validate, withDb } from '@/lib/actions/utils';
import { LOCK_MINUTES } from '@/lib/auth/constants';
import { pinMatches } from '@/lib/auth/pin';
import { clearFailures, clientKey, minutesLocked, recordFailure } from '@/lib/auth/rate-limit';
import { setSessionCookie } from '@/lib/auth/session';
import { signSession } from '@/lib/auth/token';
import type { ActionResult } from '@/lib/menu-types';
import { pinSchema } from '@/lib/schemas';

export async function login(input: unknown): Promise<ActionResult<null>> {
  const parsed = validate(pinSchema, input);
  if (!parsed.ok) return parsed.result;

  return withDb({ label: 'login', failMessage: 'Could not sign in. Try again.' }, async () => {
    const key = await clientKey();

    // Locked clients are refused before the PIN is even looked at.
    const wait = await minutesLocked(key);
    if (wait > 0) return fail(`Too many attempts. Try again in ${wait} min.`);

    if (!pinMatches(parsed.data.pin)) {
      const locked = await recordFailure(key);
      return fail(locked ? `Too many attempts. Try again in ${LOCK_MINUTES} min.` : 'Incorrect PIN.');
    }

    await clearFailures(key);
    const { token, claims } = await signSession();
    await setSessionCookie(token, claims.expiresAt);
    return ok(null);
  });
}
