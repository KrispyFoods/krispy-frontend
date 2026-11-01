import { type NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/constants';
import { readSession } from '@/lib/auth/token';

const LOGIN_PATH = '/admin/login';

/**
 * First, cheap gate for /admin: sends visitors without a genuine, unexpired session cookie to the
 * login page. It never touches the database, so it can't see signed-out (blocklisted) tokens;
 * the admin page and every Server Action re-check with `verifySession`.
 */
export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === LOGIN_PATH) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token && (await readSession(token))) return NextResponse.next();

  return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
}

export const config = {
  matcher: ['/admin/:path*'],
};
