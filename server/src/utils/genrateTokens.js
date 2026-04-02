
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "user not found while generating the tokens");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch(error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went Wrong while using the access and refresh token"
    );
  }
};