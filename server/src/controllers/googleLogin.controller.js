// import { OAuth2Client } from "google-auth-library";
// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiError } from "../utils/ApiError.js";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleLogin = async (req, res, next) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return next(new ApiError(400, "Google token is required"));
//     }

//     // 🔐 Verify token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     // ✅ Check if user exists
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Create new user
//       user = await User.create({
//         name,
//         email,
//         // dummy password + salt for security
//         password: Math.random().toString(36).slice(-10) + "Ab1!", 
//         image: { public_id: "", url: picture },
//       });
//     }

//     // 🔑 Generate tokens
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     // Save refresh token in DB
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     // 🍪 Cookie Options
//     const options = {
//       httpOnly: true, // Frontend JS access nahi kar sakegi (Secure)
//       secure: true,   // Development mein agar error de to false kar dein
//       sameSite: "None", // Cross-site requests ke liye zaroori hai
//     };

//     // ✅ Send Cookie + Structured response
//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options) // 👈 Yeh missing tha
//       .cookie("refreshToken", refreshToken, options) // 👈 Yeh missing tha
//       .json(
//         new ApiError(200, {
//           user,
//           accessToken,
//           refreshToken,
//         }, "Google login successful")
//       );

//   } catch (error) {
//     return next(new ApiError(401, "Google login failed", error.message));
//   }
// };
import { generateAccessAndRefreshToken } from "../utils/genrateTokens.js";
import { OAuth2Client } from "google-auth-library";
import {ApiError }from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google Token missing");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email, picture, sub: googleId } = ticket.getPayload();

  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      image: { public_id: "", url: picture },
    });
  } else if (!user.googleId) {
    // Pehle email se register tha  link karo
    user.googleId = googleId;
    user.image = { public_id: "", url: picture };
    await user.save({ validateBeforeSave: false });
  }else { 
    user.image = { public_id: "", url: picture };
    await user.save({ validateBeforeSave: false });
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
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
    .json(
      new ApiResponse(200, "Google login successful" ,{
        user: loggedInUser,
      })
    );
});

export { googleAuth };