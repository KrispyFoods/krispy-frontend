import { cookies } from 'next/headers';
import { cache } from 'react';
import { COOKIE_NAME, SESSION_SECONDS } from '@/lib/auth/constants';
import { readSession, type SessionClaims } from '@/lib/auth/token';
import connectDB from '@/lib/mongodb';
import { RevokedToken } from '@/models';

/** Data access layer for the admin session: every server-side "is this the admin?" goes through here. */

/** The cookie's claims if its signature and expiry are good. No database; this is the "optimistic" check. */
export async function getSession(): Promise<SessionClaims | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? readSession(token) : null;
}

/** `getSession` plus the blocklist lookup. Use this before showing or changing admin data. */
export const verifySession = cache(async (): Promise<SessionClaims | null> => {
  const claims = await getSession();
  if (!claims) return null;
  try {
    await connectDB();
    return (await RevokedToken.exists({ jti: claims.jti })) ? null : claims;
  } catch (error) {
    console.error('verifySession:', error instanceof Error ? error.message : 'unknown error');
    return null; // can't prove the token is still good, so don't trust it
  }
});

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
