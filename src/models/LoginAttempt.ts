import { type InferSchemaType, type Model, model, models, Schema } from 'mongoose';

/** Wrong-PIN counter per client, used to lock sign-in after too many failures. */
const loginAttemptSchema = new Schema({
  /** Who is being counted, e.g. "ip:203.0.113.7". */
  key: { type: String, required: true, unique: true },
  failures: { type: Number, required: true, default: 0 },
  /** Set once `failures` reaches the limit; sign-in is refused until then. */
  lockedUntil: { type: Date },
  /** End of the counting window; the TTL index below removes the row then. */
  expiresAt: { type: Date, required: true },
});

loginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type LoginAttemptDoc = InferSchemaType<typeof loginAttemptSchema>;

export const LoginAttempt =
  (models.LoginAttempt as Model<LoginAttemptDoc> | undefined) ??
  model<LoginAttemptDoc>('LoginAttempt', loginAttemptSchema);
