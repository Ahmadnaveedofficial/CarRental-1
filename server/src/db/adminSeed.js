// src/db/adminSeed.js
import mongoose from "mongoose";
import { Admin } from "../models/admin.model.js";
import dotenv from "dotenv";
dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Pehle check karo — admin pehle se hai?
  const existing = await Admin.findOne({ email: "admin@carrental.com" });
  if (existing) {
    console.log("✅ Admin already exists");
    process.exit();
  }

  // Admin create karo
  await Admin.create({
    name: "Super Admin",
    email: "admin@carrental.com",
    password: "Admin@123",  // pre-save hook se automatically hash ho jayega
  });

  console.log("✅ Admin created successfully");
  process.exit();
};

createAdmin();