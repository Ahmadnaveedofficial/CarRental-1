import { registerUser,loginUser, getUserData, logoutUser,updateUserProfile,changeCurrentPassword, getCarBookedDates,getCars ,updateProfileImage} from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
const userRouter=Router();

userRouter.route("/register")
        .post(upload.fields([{name:"image",maxCount:1}]),registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/data").get(verifyJWT,getUserData)
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/cars").get(getCars)
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/update-profile").post(verifyJWT, updateUserProfile);
userRouter.route("/update-profile-image").post(verifyJWT,upload.single("image"), updateProfileImage);
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
userRouter.route("/cars/:id/booked-dates").get(getCarBookedDates);




export default userRouter;