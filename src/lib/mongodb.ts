import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & { mongoose?: MongooseCache };

// Cached on globalThis so dev hot reloads reuse one connection instead of opening a new one each time.
const cached: MongooseCache = (globalWithMongoose.mongoose ??= { conn: null, promise: null });

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define MONGODB_URI in .env');
  }

  if (cached.conn) {
    return cached.conn;
  }

  cached.promise ??= mongoose.connect(uri);

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // let the next call retry instead of reusing a rejected promise
    throw error;
  }

  return cached.conn;
}

export default connectDB;
