import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastenode:x2KZode8FWdKZTd0@namastenode.qo608iu.mongodb.net/devTinder",
  );
};
