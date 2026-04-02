import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changeRoleToOwner,
  addCar,
  updateCar,
  ownerCars,
  toggleCarAvailability,
  deleteCar,
  getOwnerDashboardData,
  updateProfileImage,
} from "../controllers/owner.controller.js";
import {
  addBlog,
  updateBlog,
  ownerBlogs,
  toggleBlogAvailability,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const ownerRouter = Router();
ownerRouter.use(verifyJWT);

// Cars routes
ownerRouter.route("/change-role").post(changeRoleToOwner);
ownerRouter.route("/add-car").post(upload.array("images", 10), addCar); 
ownerRouter.route("/edit-car/:id").patch(upload.array("images", 10), updateCar);
ownerRouter.route("/cars").get(ownerCars);
ownerRouter.route("/toggle-car").post(toggleCarAvailability);
ownerRouter.route("/delete-car").post(deleteCar);
ownerRouter.route("/dashboard").get(getOwnerDashboardData);
ownerRouter
  .route("/update-profile-image")
  .post(upload.single("image"), updateProfileImage);

// Blog routes
ownerRouter.route("/add-blog").post(upload.array("images", 10), addBlog);
ownerRouter.route("/blogs").get(ownerBlogs);
ownerRouter
  .route("/edit-blog/:id")
  .patch(upload.array("images", 10), updateBlog);
ownerRouter.route("/toggle-blog/:id").patch(toggleBlogAvailability);
ownerRouter.route("/delete-blog/:id").delete(deleteBlog);

export default ownerRouter;
