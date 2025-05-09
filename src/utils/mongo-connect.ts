// db.js
const mongoose = require("mongoose");

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/market");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", (error as Error).message);
  }
};

connectDB();