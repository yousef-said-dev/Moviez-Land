import mongoose from 'mongoose';

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}


export async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;

  if (!MONGODB_URI) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Warning: MONGODB_URI is not defined during production build phase. Skipping connection.');
      return null;
    }
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

