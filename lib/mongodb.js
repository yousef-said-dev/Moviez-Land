import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI
}




let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}


export async function dbConnect() {
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

