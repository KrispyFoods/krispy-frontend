import { type InferSchemaType, type Model, model, models, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  { timestamps: true },
);

export type CategoryDoc = InferSchemaType<typeof categorySchema>;

export const Category =
  (models.Category as Model<CategoryDoc> | undefined) ?? model<CategoryDoc>('Category', categorySchema);
