import mongoose from "mongoose";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PWD = process.env.MONGODB_PWD;

if (!MONGODB_URI && !MONGODB_USER && !MONGODB_PWD) {
  throw new Error(
    "Please define the MONGODB environment variables inside .env.local"
  );
}

mongoose.set("strictQuery", true);
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      cached.promise = mongoose
        .connect(MONGODB_URI, {
          tls: true,
          tlsCAFile: path.join(process.cwd(), "data/root-ca.crt"),
          user: MONGODB_USER,
          pass: MONGODB_PWD,
        })
        .then((mongoose) => {
          return mongoose;
        });
    } catch (error) {
      console.error(error);
    }
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
