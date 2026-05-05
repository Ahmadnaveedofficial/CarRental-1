// import {ApiError }from "../utils/ApiError.js";
// import {ApiResponse} from "../utils/ApiResponse.js";
// import {asyncHandler} from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken || 
//       req.header("Authorization")?.replace("Bearer ", "");  
//     if (!token) {
//     return null;
//     }
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );
//     if (!user) {
//       return res.status(400).json( new ApiResponse(401, "Invalid access token"));
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(400).json( new ApiResponse(401, error?.message || "invalid access token"));
//   }
// });
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js"; // ← sirf yeh add karo

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(400).json(new ApiResponse(401, "Invalid access token"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(401, error?.message || "invalid access token"));
  }
});

// ─────────────────────────────────────────
// Admin verify — same style
// ─────────────────────────────────────────
export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Admin model mein dhundo — User mein nahi
    const admin = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!admin) {
      return res.status(401).json(new ApiResponse(401, "Invalid access token"));
    }

    req.user = admin;
    next();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(401, error?.message || "Invalid access token"));
  }
});