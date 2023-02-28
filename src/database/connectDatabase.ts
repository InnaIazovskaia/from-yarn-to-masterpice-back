import mongoose from "mongoose";

const connectDatabase = async (connectionString: string) => {
  mongoose.set("strictQuery", false);
  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret._v;
    },
  });

  try {
    await mongoose.connect(connectionString);
  } catch (error) {
    throw new Error("Database not connected");
  }
};

export default connectDatabase;
