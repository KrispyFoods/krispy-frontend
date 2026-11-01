import { jwtVerify, SignJWT } from 'jose';
import { SESSION_SECONDS } from '@/lib/auth/constants';

/** Signs and reads the session token. Pure crypto, no database, so the proxy can use it too. */

export interface SessionClaims {
  /** Unique token id; what the blocklist stores. */
  jti: string;
  expiresAt: Date;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('Define AUTH_SECRET (32+ characters) in .env');
  return new TextEncoder().encode(secret);
}

export async function signSession(): Promise<{ token: string; claims: SessionClaims }> {
  const jti = crypto.randomUUID();
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secretKey());
  return { token, claims: { jti, expiresAt: new Date(exp * 1000) } };
}

/** The claims of a genuine, unexpired token, or null for anything else. */
export async function readSession(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    if (!payload.jti || !payload.exp) return null;
    return { jti: payload.jti, expiresAt: new Date(payload.exp * 1000) };
  } catch {
    return null;
  }
}
