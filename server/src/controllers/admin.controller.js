import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { Car } from "../models/car.model.js";
import { Booking } from "../models/booking.model.js";
import { deleteOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// ─────────────────────────────────────────
// Admin ka refresh + access token generate
// ─────────────────────────────────────────
const generateAdminTokens = async (adminId) => {
  const admin = await Admin.findById(adminId);
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// ─────────────────────────────────────────
// Admin Login
// ─────────────────────────────────────────
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAdminTokens(admin._id);

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json(new ApiResponse(200, "Admin logged in successfully", { admin: loggedInAdmin }));
});

// ─────────────────────────────────────────
// Admin Logout
// ─────────────────────────────────────────
const logoutAdmin = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const admin = await Admin.findOne({ refreshToken });
    if (admin) {
      admin.refreshToken = null;
      await admin.save({ validateBeforeSave: false });
    }
  }

  return res
    .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" })
    .clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" })
    .json(new ApiResponse(200, "Admin logged out successfully"));
});

// ─────────────────────────────────────────
// Admin Refresh Token
// ─────────────────────────────────────────
const refreshAdminAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id);
    if (!admin) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== admin.refreshToken) {
      throw new ApiError(401, "Refresh token expired or reused");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAdminTokens(admin._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None" })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "None" })
      .json(new ApiResponse(200, "Token refreshed successfully", accessToken));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

// ─────────────────────────────────────────
// Get Admin Data (JWT se)
// ─────────────────────────────────────────
const getAdminData = asyncHandler(async (req, res) => {
  const { user } = req; // middleware se aayega
  if (!user) {
    throw new ApiError(404, "Admin not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Admin data fetched successfully", user));
});

// ─────────────────────────────────────────
// Dashboard Stats
// ─────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalOwners = await User.countDocuments({ role: "owner" });
  const totalCars = await Car.countDocuments();
  const totalBookings = await Booking.countDocuments();

  return res.status(200).json(
    new ApiResponse(200, "Dashboard stats fetched successfully", {
      totalUsers,
      totalOwners,
      totalCars,
      totalBookings,
    })
  );
});

// ─────────────────────────────────────────
// Users Management
// ─────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Cloudinary se image delete karo agar hai
  if (user?.image?.public_id) {
    await deleteOnCloudinary(user.image.public_id);
  }

  await User.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
});

// ─────────────────────────────────────────
// Owners Management
// ─────────────────────────────────────────
const getAllOwners = asyncHandler(async (req, res) => {
  const owners = await User.find({ role: "owner" }).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, "Owners fetched successfully", owners));
});

const deleteOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const owner = await User.findById(id);
  if (!owner) {
    throw new ApiError(404, "Owner not found");
  }

  // Owner ki sari cars bhi delete karo
  const ownerCars = await Car.find({ owner: id });
  for (const car of ownerCars) {
    if (car?.image?.public_id) {
      await deleteOnCloudinary(car.image.public_id);
    }
    await Car.findByIdAndDelete(car._id);
  }

  if (owner?.image?.public_id) {
    await deleteOnCloudinary(owner.image.public_id);
  }

  await User.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Owner and their cars deleted successfully"));
});

// ─────────────────────────────────────────
// Cars Management
// ─────────────────────────────────────────
const getAllCars = asyncHandler(async (req, res) => {
  const cars = await Car.find().populate("owner", "name email phone");
  return res
    .status(200)
    .json(new ApiResponse(200, "Cars fetched successfully", cars));
});

const deleteCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const car = await Car.findById(id);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  if (car?.image?.public_id) {
    await deleteOnCloudinary(car.image.public_id);
  }

  await Car.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Car deleted successfully"));
});

// ─────────────────────────────────────────
// Bookings Management
// ─────────────────────────────────────────
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email phone")
    .populate("car", "name model price");

  return res
    .status(200)
    .json(new ApiResponse(200, "Bookings fetched successfully", bookings));
});

export {
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
};