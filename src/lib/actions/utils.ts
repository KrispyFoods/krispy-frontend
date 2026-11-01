import { isValidObjectId } from 'mongoose';
import type { ZodType, infer as Infer } from 'zod';
import { verifySession } from '@/lib/auth/session';
import type { ActionResult } from '@/lib/menu-types';
import connectDB from '@/lib/mongodb';
import { toFieldErrors } from '@/lib/schemas';

/** Small building blocks shared by every server action (validate -> run against the DB -> result). */

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });

export function fail(error: string, fieldErrors?: Record<string, string>): ActionResult<never> {
  return { ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) };
}

/**
 * Guard for every action that changes admin data: returns a result to hand straight back when
 * the caller is not signed in, otherwise null. Server Actions are public endpoints, so hiding
 * the admin page is not enough.
 */
export async function requireAdmin(): Promise<ActionResult<never> | null> {
  if (await verifySession()) return null;
  return { ok: false, error: 'Your session ended. Sign in again.', code: 'unauthorized' };
}

export function logError(label: string, error: unknown) {
  // Message only: never dump the whole error object, it can carry connection strings.
  // Cloudinary rejects with a plain { message, http_code } object, not an Error.
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : 'unknown error';
  console.error(`${label}:`, message);
}

/** MongoDB duplicate key error (a unique index was violated). */
function isDuplicateKey(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
}

type Parsed<S extends ZodType> = { ok: true; data: Infer<S> } | { ok: false; result: ActionResult<never> };

/** Parse untrusted input; on failure `result` is ready to return from the action. */
export function validate<S extends ZodType>(schema: S, input: unknown): Parsed<S> {
  const parsed = schema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, result: fail('Check the highlighted fields.', toFieldErrors(parsed.error)) };
}

/** Returns a "not found" result when `id` is not a Mongo ObjectId, otherwise null. */
export function invalidId(id: string, notFoundMessage: string): ActionResult<never> | null {
  return isValidObjectId(id) ? null : fail(notFoundMessage);
}

interface DbOptions {
  label: string;
  failMessage: string;
  /** Returned when a unique index is violated. */
  onDuplicate?: ActionResult<never>;
}

/** Connect, run, and turn any unexpected error into a safe `fail` result (logged server-side). */
export async function withDb<T>(
  { label, failMessage, onDuplicate }: DbOptions,
  run: () => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  try {
    await connectDB();
    return await run();
  } catch (error) {
    if (onDuplicate && isDuplicateKey(error)) return onDuplicate;
    logError(label, error);
    return fail(failMessage);
  }
}
