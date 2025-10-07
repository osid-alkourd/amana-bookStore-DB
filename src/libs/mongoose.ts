import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("⚠️ Please add MONGODB_URI to your environment variables");
}

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

// Reuse connection in dev to avoid multiple connections
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache =
  globalWithMongoose.mongooseCache || { conn: null, promise: null };

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // ✅ TypeScript now knows it's always a string
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongooseCache = cached;
  return cached.conn;
}
