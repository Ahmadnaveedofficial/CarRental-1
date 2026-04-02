import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Cancelled", "Confirmed", "Pending"],
      default: "Pending",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Booking = new mongoose.model("Booking", bookingSchema);
