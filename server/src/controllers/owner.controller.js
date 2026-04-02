import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Car } from "../models/car.model.js";
import { Booking } from "../models/booking.model.js";

// change role
const changeRoleToOwner = asyncHandler(async (req, res) => {
  const { _id, role } = req.user;

  const newRole = role === "owner" ? "user" : "owner";

  const user = await User.findByIdAndUpdate(
    _id,
    { role: newRole },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, `Role changed to ${newRole}`, user));
});

//  Add car
const addCar = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  let car = JSON.parse(req.body.carData);

  const files = req.files;

  if (!files || files.length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "At least one image is required"));
  }

  // Upload all images to Cloudinary
  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      return {
        public_id: result.public_id || "",
        url: result.secure_url || "",
      };
    })
  );

  const newCar = await Car.create({
    ...car,
    owner: _id,
    images: uploadedImages,
    // Keep image field as first image for backward compatibility
    image: uploadedImages[0],
  });

  res.status(201).json(new ApiResponse(201, "Car added successfully", newCar));
});

// ✅ Update car — edit fields + manage images (blog pattern)
const updateCar = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { carData, existingImages } = req.body;

  const car = await Car.findOne({ _id: id, owner: _id });
  if (!car) {
    return res.status(404).json(new ApiResponse(404, "Car not found"));
  }

  // Delete removed images from Cloudinary
  const keptImages = existingImages ? JSON.parse(existingImages) : [];
  const keptPublicIds = keptImages.map((img) => img.public_id).filter(Boolean);
  const removedImages = (car.images || []).filter(
    (img) => img.public_id && !keptPublicIds.includes(img.public_id)
  );
  await Promise.all(
    removedImages.map((img) => deleteOnCloudinary(img.public_id))
  );

  // Upload new images
  const newFiles = req.files || [];
  const newUploaded = await Promise.all(
    newFiles.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      return {
        public_id: result.public_id || "",
        url: result.secure_url || "",
      };
    })
  );

  const finalImages = [...keptImages, ...newUploaded];

  if (finalImages.length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "At least one image is required"));
  }

  // Update car fields
  const updatedData = carData ? JSON.parse(carData) : {};

  const updatedCar = await Car.findByIdAndUpdate(
    id,
    {
      ...updatedData,
      images: finalImages,
      image: finalImages[0], // first image as main image
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Car updated successfully", updatedCar));
});

// list all cars of the owner
const ownerCars = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const cars = await Car.find({ owner: _id });
  res
    .status(200)
    .json(new ApiResponse(200, "Owner's cars retrieved successfully", cars));
});

// toggle car availability
const toggleCarAvailability = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { carId } = req.body;

  const car = await Car.findOne({ _id: carId, owner: _id });

  if (!car) {
    return res.status(404).json(new ApiResponse(404, "Car not found"));
  }

  car.isAvailable = !car.isAvailable;
  await car.save();

  res.status(200).json(new ApiResponse(200, "Car toggled successfully", car));
});

// delete a car
const deleteCar = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { carId } = req.body;

  const car = await Car.findOne({ _id: carId, owner: _id });

  if (!car) {
    return res.status(404).json(new ApiResponse(404, "Car not found"));
  }

  // Delete all images from Cloudinary
  if (car.images?.length > 0) {
    await Promise.all(
      car.images.map(async (img) => {
        if (img.public_id) await deleteOnCloudinary(img.public_id);
      })
    );
  }

  await Car.findByIdAndDelete(carId);
  await Booking.deleteMany({ car: carId });

  res.status(200).json(new ApiResponse(200, "Car deleted successfully", car));
});

// get dashboard data for owner
const getOwnerDashboardData = asyncHandler(async (req, res) => {
  const { _id, role } = req.user;
  if (role !== "owner") {
    return res
      .status(403)
      .json(
        new ApiError(
          403,
          "Access denied. Only owners can access this resource."
        )
      );
  }

  const cars = await Car.find({ owner: _id });
  const bookings = await Booking.find({ owner: _id })
    .populate("car")
    .sort({ createdAt: -1 });

  const pendingBookings = await Booking.find({ owner: _id, status: "Pending" });
  const completedBookings = await Booking.find({
    owner: _id,
    status: "Confirmed",
  });
  const cancelledBookings = await Booking.find({
    owner: _id,
    status: "Cancelled",
  });

  const monthlyEarnings = bookings
    .slice()
    .filter((booking) => booking.status === "Confirmed")
    .reduce((acc, booking) => acc + booking.price, 0);

  const dashboardData = {
    totalCars: cars.length,
    totalBookings: bookings.length,
    pendingBookings: pendingBookings.length,
    completedBookings: completedBookings.length,
    recentBookings: bookings.slice(0, 5),
    monthlyEarnings,
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Owner dashboard data retrieved successfully",
        dashboardData
      )
    );
});

// update profile image
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
    { returnDocument: "after" }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, "Image updated successfully", updatedUser));
});

export {
  changeRoleToOwner,
  addCar,
  updateCar,
  updateProfileImage,
  ownerCars,
  toggleCarAvailability,
  deleteCar,
  getOwnerDashboardData,
};
