import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Car } from "../models/car.model.js";
import { Booking } from "../models/booking.model.js";
import { generateAccessAndRefreshToken } from "../utils/genrateTokens.js";
import jwt from "jsonwebtoken";
// register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password, phone, cnic, address, dob, gender } = req.body;

  if (
    [name, email, password, phone, cnic].some((field) => field?.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All Fields are requireds"));
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.status(400).json(new ApiResponse(409, "email is already exist"));
  }
  let imageData = {
    public_id: "",
    url: "",
  };

  const imageLocalPath = req.file?.path;
  if (imageLocalPath) {
    const image = await uploadOnCloudinary(imageLocalPath);
    imageData = {
      public_id: image.public_id || "",
      url: image.secure_url || "",
    };
  }

  const user = await User.create({
    name,
    email,
    image: imageData,
    password,
    phone,
    cnic,
    address,
    dob,
    gender,
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!userCreated) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Something went wrong while register user"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "user Register Successfully", userCreated));
});

// user login

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, " email is required");
  }

  if (!password) {
    throw new ApiError(400, " password is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "email does not exist in this system");
  }

  const checkPassword = await user.comparePassword(password);

  if (!checkPassword) {
    throw new ApiError(401, "Inavlid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
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
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
      }),
    );
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }
  }

  return res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json(new ApiResponse(200, "Logged out successfully"));
});
// const logoutUser = asyncHandler(async (req, res) => {
//   return res
//     .status(200)
//     .clearCookie("accessToken", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     })
//     .clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     })
//     .json(new ApiResponse(200, null, "Logged out successfully")
//     );
// });
// get user data using jwt token

const getUserData = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "user data fetched successfully", user));
});

// all cars for frontend

const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ isAvailable: true }).populate("owner");
  res
    .status(200)
    .json(new ApiResponse(200, "available cars fetched successfully", cars));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or reused");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, "Token refreshed successfully", accessToken));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { name, phone, address, dob, gender } = req.body;

  if (
    [name, phone, address, dob, gender].every(
      (field) => field === undefined || field?.trim() === "",
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "At least one field is required"));
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "User not found"));
  }

  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (address !== undefined) user.address = address.trim();
  if (dob !== undefined) user.dob = dob;
  if (gender !== undefined) user.gender = gender;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(userId).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", updatedUser));
});

const updateProfileImage = asyncHandler(async (req, res) => {
  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    return res.status(400).json(new ApiResponse(400, "Image file is missing"));
  }

  const uploadedImage = await uploadOnCloudinary(imageLocalPath);

  if (!uploadedImage?.url) {
    throw new ApiError(400, "Error while uploading image");
  }

  const user = await User.findById(req.user?._id);

  if (user?.image?.public_id) {
    await deleteOnCloudinary(user.image.public_id);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        image: {
          public_id: uploadedImage.public_id,
          url: uploadedImage.url,
        },
      },
    },
    { returnDocument: "after" },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, "Image updated successfully", updatedUser));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Request body is missing"));
  }
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiResponse(400, "Invalid Password"));
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "password changed successfully"));
});

const getCarBookedDates = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({
    car: id,
    status: { $ne: "Cancelled" },
  }).select("pickupDate returnDate");

  return res
    .status(200)
    .json(new ApiResponse(200, "Booked dates fetched", bookings));
});




export {
  registerUser,
  refreshAccessToken,
  loginUser,
  getUserData,
  logoutUser,
  getCars,
  getCarBookedDates,
  changeCurrentPassword,
  updateProfileImage,
  updateUserProfile,
};
