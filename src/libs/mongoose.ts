import mongoose from "mongoose";

// Do NOT read env at the top-level and throw immediately
// Instead, check only when connecting
let cached = (global as any).mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("⚠️ MONGODB_URI is not defined. Make sure it's in your .env.local or environment variables.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
