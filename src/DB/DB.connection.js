import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGOOSE_URL, {
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("Database connected");
//   console.log(cached.conn);
  console.log(process.env.MONGOOSE_URL);
  
  
  return cached.conn;
};

export default connectDB;
