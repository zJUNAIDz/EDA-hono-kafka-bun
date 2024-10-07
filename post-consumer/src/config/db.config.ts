import mongoose from "mongoose";

export const connectToDB = async (connectionString: string) => await mongoose.connect(connectionString)
  .then(() => console.log("Connected to DB"))
  .catch(() => console.error("Failed to connect to DB"));
  