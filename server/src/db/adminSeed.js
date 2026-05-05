import mongoose from "mongoose";
import { Admin } from "../models/admin.model.js";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    const adminCount = await Admin.countDocuments();
    console.log("TOTAL ADMINS:", adminCount);

    const existing = await Admin.findOne({ email: "admin@carrental.com" });

    if (existing) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "Super Admin",
      email: "admin@carrental.com",
      password: "Admin@123",
    });

    console.log("✅ Admin created successfully");

    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

createAdmin();