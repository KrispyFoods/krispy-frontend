import { headers } from 'next/headers';
import { LOCK_MINUTES, MAX_ATTEMPTS } from '@/lib/auth/constants';
import { LoginAttempt } from '@/models';

/** Counts wrong PINs per client IP and locks sign-in after too many. Call after connectDB(). */

const LOCK_MS = LOCK_MINUTES * 60_000;

/** Which client this request counts against. */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

/** Minutes left on the lock, or 0 when sign-in is allowed. */
export async function minutesLocked(key: string): Promise<number> {
  const attempt = await LoginAttempt.findOne({ key, lockedUntil: { $gt: new Date() } }).lean();
  return attempt?.lockedUntil ? Math.ceil((attempt.lockedUntil.getTime() - Date.now()) / 60_000) : 0;
}

/** Counts one wrong PIN. Returns true when this failure locked the client out. */
export async function recordFailure(key: string): Promise<boolean> {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + LOCK_MS);

  // The TTL sweep only runs about once a minute, so drop an already-expired counter ourselves.
  await LoginAttempt.deleteOne({ key, expiresAt: { $lte: now } });
  const attempt = await LoginAttempt.findOneAndUpdate(
    { key },
    { $inc: { failures: 1 }, $set: { expiresAt: windowEnd } },
    { upsert: true, returnDocument: 'after' },
  ).lean();

  if (attempt.failures < MAX_ATTEMPTS) return false;
  await LoginAttempt.updateOne({ key }, { $set: { lockedUntil: windowEnd } });
  return true;
}

export async function clearFailures(key: string): Promise<void> {
  await LoginAttempt.deleteOne({ key });
}
