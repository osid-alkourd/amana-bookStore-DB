import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  isbn: string;
  genre: string[];
  tags: string[];
  datePublished: Date;
  pages: number;
  language: string;
  publisher: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
}

const BookSchema = new Schema<IBook>(
  {
    id: { type: String, required: true, unique: true }, // keep your custom id
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    isbn: { type: String, unique: true },
    genre: [{ type: String }],
    tags: [{ type: String }],
    datePublished: { type: Date },
    pages: { type: Number },
    language: { type: String },
    publisher: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
