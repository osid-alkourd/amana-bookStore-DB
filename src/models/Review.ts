import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  id: string; // custom id for your reviews
  bookId: string; // reference to the related book
  author: string;
  rating: number;
  title: string;
  comment: string;
  timestamp: Date;
  verified: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true, unique: true },
    bookId: { type: String, required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Reuse existing model in dev to avoid OverwriteModelError
export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
