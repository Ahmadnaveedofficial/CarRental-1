// src/routes/admin.routes.js
import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  refreshAdminAccessToken,
  getAdminData,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllOwners,
  deleteOwner,
  getAllCars,
  deleteCar,
  getAllBookings,
} from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

// ─────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/refresh-token").post(refreshAdminAccessToken);

// ─────────────────────────────────────────
// Protected Routes
// ─────────────────────────────────────────
adminRouter.route("/logout").post(verifyAdminJWT, logoutAdmin);
adminRouter.route("/me").get(verifyAdminJWT, getAdminData);

// Dashboard
adminRouter.route("/dashboard").get(verifyAdminJWT, getDashboardStats);

// Users
adminRouter.route("/users").get(verifyAdminJWT, getAllUsers);
adminRouter.route("/users/:id").delete(verifyAdminJWT, deleteUser);

// Owners
adminRouter.route("/owners").get(verifyAdminJWT, getAllOwners);
adminRouter.route("/owners/:id").delete(verifyAdminJWT, deleteOwner);

// Cars
adminRouter.route("/cars").get(verifyAdminJWT, getAllCars);
adminRouter.route("/cars/:id").delete(verifyAdminJWT, deleteCar);

// Bookings
adminRouter.route("/bookings").get(verifyAdminJWT, getAllBookings);

export default adminRouter;