import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { Car } from "../models/car.model.js";
import {sendBookingEmail,sendCancelEmail} from "../sendBookingEmails/sendBookingEmail.js"
import {User} from "../models/user.model.js"
// check availability of car for given dates

const checkCarAvailability = async (car, pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);

  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnD },
    returnDate: { $gte: pickup },
  });

  return bookings.length === 0;
};

// check availability of cars for given dates and location

const checkAvailabilityOfCars = asyncHandler(async (req, res) => {
  const { location, pickupDate, returnDate } = req.body;

  // find cars in the given location
  const cars = await Car.find({
    location: { $regex: location, $options: "i" },
    isAvailable: true,
  });

  // check car availability for given dates using promise.all to run in parallel
  const availableCars = cars.map(async (car) => {
    const isAvailable = await checkCarAvailability(
      car._id,
      pickupDate,
      returnDate
    );
    return { ...car._doc, isAvailable: isAvailable };
  });

  let availableCarsData = await Promise.all(availableCars);
  availableCarsData = availableCarsData.filter(
    (car) => car.isAvailable === true
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Available cars for the given location and dates",
        availableCarsData
      )
    );
});

// create booking for a car
const createBooking = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { car, pickupDate, returnDate } = req.body;

  if (!car || !pickupDate || !returnDate) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", null));
  }
  if (new Date(returnDate) <= new Date(pickupDate)) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "Return date must be after pickup date", null)
      );
  }
  const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);

  if (!isAvailable) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Car is not available for the selected dates",
          null
        )
      );
  }

  const carData = await Car.findById(car);

  //calculate total price for the booking based on pick and return date and price per day of the car
  const picked = new Date(pickupDate);
  const returned = new Date(returnDate);
  const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
  const price = carData.pricePerDay * noOfDays;

  const booking = await Booking.create({
    car,
    owner: carData.owner,
    user: _id,
    pickupDate,
    returnDate,
    price,
  });
  const userData=await User.findById(_id)
  sendBookingEmail(userData.email,userData.name,carData,booking)
  res
    .status(201)
    .json(new ApiResponse(201, "Booking created successfully", booking));
});

// list all the bookings of a user

const userBookings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const bookings = await Booking.find({ user: _id })
    .populate("car")
    .populate("owner","name image email")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, "User bookings retrieved successfully", bookings)
    );
});

// get owner bookings

const ownerBookings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (req.user.role !== "owner") {
    throw new ApiError(403, "Only owners can access their bookings");
  }
  const bookings = await Booking.find({ owner: _id })
    .populate("car")
    .populate("user", "name email phone role image createdAt")
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, "Owner bookings retrieved successfully", bookings)
    );
});

//change booking status by owner

const changeBookingStatus = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bookingId, status } = req.body;

  const booking = await Booking.findById(bookingId);

  if (booking.owner.toString() !== _id.toString()) {
    throw new ApiResponse(
      404,
      "UNauthorized to change the status of this booking"
    );
  }
  booking.status = status;
  await booking.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Booking status updated successfully", booking));
});
const userCancelBooking = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bookingId } = req.body;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

 const booking = await Booking.findById(bookingId)
  .populate("user", "name email")
  .populate("car");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if this booking belongs to the user
  if (booking.user._id.toString() !== _id.toString()) {
    throw new ApiError(403, "Unauthorized to cancel this booking");
  }

  // Check if already cancelled
  if (booking.status === "Cancelled") { 
    throw new ApiError(400, "Booking is already cancelled");
  }

  // Check if pickup date has already passed
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickupDate = new Date(booking.pickupDate);
  pickupDate.setHours(0, 0, 0, 0);

  if (pickupDate <= today) {
    throw new ApiError(400, "Cannot cancel booking on or after pickup date");
  }

  booking.status = "Cancelled";
  
  await booking.save();
 sendCancelEmail(
      booking.user.email,
      booking.user.name,
      booking.car,
      booking
    );
  res
    .status(200)
    .json(new ApiResponse(200, "Booking cancelled successfully", booking));
})
export {
  checkCarAvailability,
  checkAvailabilityOfCars,
  createBooking,
  userBookings,
  ownerBookings,
  userCancelBooking,
  changeBookingStatus,
};

// import asyncHandler from "../utils/asyncHandler.js";
// import {ApiError} from "../utils/ApiError.js";
// import {ApiResponse} from "../utils/ApiResponse.js";
// import { Booking } from "../models/booking.model.js";
// import { Car } from "../models/car.model.js";

// // check availability of car for given dates

// const checkCarAvailability = asyncHandler(
//   async (car, pickupDate, returnDate) => {
//     const bookings = await Booking.find({
//       car,
//       pickupDate: { $lt: returnDate },
//       returnDate: { $gt: pickupDate },
//     });
//     return bookings.length === 0;
//   }
// );

// // check availability of cars for given dates and location

// const checkAvailabilityOfCars = asyncHandler(async (req, res) => {
//   const { location, pickupDate, returnDate } = req.body;

//   // find cars in the given location
//   const cars = await Car.find({ location, isAvailable: true });

//   // check car availability for given dates using promise.all to run in parallel
//   const availableCars = cars.map(async (car) => {
//     const isAvailable = await checkCarAvailability(
//       car._id,
//       pickupDate,
//       returnDate
//     );
//     return { ...car._doc, isAvailable: isAvailable };
//   });

//   let availableCarsData = await Promise.all(availableCars);
//   availableCarsData = availableCarsData.filter(
//     (car) => car.isAvailable === true
//   );
//   res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         "Available cars for the given location and dates",
//         availableCarsData
//       )
//     );
// });

// // create booking for a car
// const createBooking = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { car, pickupDate, returnDate } = req.body;

//   const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);

//   if (!isAvailable) {
//     throw new ApiError(400, "Car is not available for the selected dates");
//   }

//   const carData = await Car.findById(car);

//   //calculate total price for the booking based on pick and return date and price per day of the car
//   const picked = new Date(pickupDate);
//   const returned = new Date(returnDate);
//   const noOfDays = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
//   const price = carData.pricePerDay * noOfDays;

//   const booking = await Booking.create({
//     car,
//     owner: carData.owner,
//     user: _id,
//     pickupDate,
//     returnDate,
//     price,
//   });

//   res
//     .status(201)
//     .json(new ApiResponse(201, "Booking created successfully", booking));
// });

// // list all the bookings of a user

// const userBookings = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const bookings = await Booking.find({ user: _id })
//     .populate("car")
//     .sort({ createdAt: -1 });
//   res
//     .status(200)
//     .json(
//       new ApiResponse(200, bookings, "User bookings retrieved successfully")
//     );
// });

// // get owner bookings

// const ownerBookings = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   if (req.user.role !== "owner") {
//     throw new ApiError(403, "Only owners can access their bookings");
//   }
//   const bookings = await Booking.find({ owner: _id })
//     .populate("car user")
//     .select("-password -refreshToken")
//     .sort({ createdAt: -1 });
//   res
//     .status(200)
//     .json(
//       new ApiResponse(200, bookings, "Owner bookings retrieved successfully")
//     );
// });

// //change booking status by owner

// const changeBookingStatus = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { bookingId, status } = req.body;

//   const booking = await Booking.findById(bookingId);

//   if (booking.owner.toString() !== _id.toString()) {
//     throw new ApiError(
//       404,
//       "UNauthorized to change the status of this booking"
//     );
//   }
//   booking.status = status;
//   await booking.save();
//   res
//     .status(200)
//     .json(new ApiResponse(200, "Booking status updated successfully", booking));
// });

// export {
//   checkCarAvailability,
//   checkAvailabilityOfCars,
//   createBooking,
//   userBookings,
//   ownerBookings,
//   changeBookingStatus,
// };