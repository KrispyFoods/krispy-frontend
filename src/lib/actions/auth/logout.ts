'use server';

import { logError, ok } from '@/lib/actions/utils';
import { clearSessionCookie, getSession } from '@/lib/auth/session';
import type { ActionResult } from '@/lib/menu-types';
import connectDB from '@/lib/mongodb';
import { RevokedToken } from '@/models';

export async function logout(): Promise<ActionResult<null>> {
  const claims = await getSession();

  if (claims) {
    try {
      await connectDB();
      // Blocklist the token until it would have expired anyway, so a copied cookie stops working too.
      await RevokedToken.updateOne(
        { jti: claims.jti },
        { $setOnInsert: { expiresAt: claims.expiresAt } },
        { upsert: true },
      );
    } catch (error) {
      logError('logout', error);
    }
  }

  // The browser always forgets the cookie, even if the blocklist write failed.
  await clearSessionCookie();
  return ok(null);
}
