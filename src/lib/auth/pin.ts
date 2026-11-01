import { createHash, timingSafeEqual } from 'node:crypto';
import { PIN_LENGTH } from '@/lib/auth/constants';

const digest = (value: string) => createHash('sha256').update(value).digest();

/**
 * Compares in constant time (equal-length digests, no early exit) so response timing
 * reveals nothing. Fails closed when ADMIN_PIN is missing or malformed.
 */
export function pinMatches(input: string): boolean {
  const expected = process.env.ADMIN_PIN;
  if (!expected || !new RegExp(`^\\d{${PIN_LENGTH}}$`).test(expected)) return false;
  return timingSafeEqual(digest(input), digest(expected));
}
