import { type InferSchemaType, type Model, model, models, Schema } from 'mongoose';

const dishSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, default: '', maxlength: 500 },
    /** Whole LKR, e.g. 3900. Format with toLocaleString() for display ("3,900"). */
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    /** Cloudinary secure_url, e.g. "https://res.cloudinary.com/<cloud>/image/upload/.../krispy/dishes/abc.webp". */
    image: { type: String, trim: true },
    /** Cloudinary public id, kept so the asset can be deleted with the dish. */
    imagePublicId: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

dishSchema.index({ category: 1, name: 1 }, { unique: true });

export type DishDoc = InferSchemaType<typeof dishSchema>;

export const Dish = (models.Dish as Model<DishDoc> | undefined) ?? model<DishDoc>('Dish', dishSchema);
