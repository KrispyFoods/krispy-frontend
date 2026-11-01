import { type InferSchemaType, type Model, model, models, Schema } from 'mongoose';

/** Blocklist of session tokens that were signed out before they expired. */
const revokedTokenSchema = new Schema({
  /** The token's unique id (`jti` claim). */
  jti: { type: String, required: true, unique: true },
  /** When the token would have expired anyway; the TTL index below removes the row then. */
  expiresAt: { type: Date, required: true },
});

revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RevokedTokenDoc = InferSchemaType<typeof revokedTokenSchema>;

export const RevokedToken =
  (models.RevokedToken as Model<RevokedTokenDoc> | undefined) ??
  model<RevokedTokenDoc>('RevokedToken', revokedTokenSchema);
