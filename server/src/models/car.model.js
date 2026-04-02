import mongoose, { Schema } from "mongoose";

const carSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: {
        public_id: String,
        url: String,
      },
      required: true,
    },
    images: {
      type: [
        {
          public_id: String,
          url: String,
        },
      ],
      default: [],
    },
    year: {
      type: Number,
      min: 1980,
      max: new Date().getFullYear(),
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Sedan",
        "SUV",
        "Hatchback",
        "Luxury",
        "Sports",
        "Van",
        "Coupe",
        "Convertible",
        "Pickup Truck",
        "Crossover",
        "Minivan",
        "Wagon",
        "Electric",
      ],
      required: true,
    },
    seating_capacity: {
      type: Number,
      min: 2,
      required: true,
    },
    fuel_type: {
      type: String,
      enum: ["Petrol", "Gas", "Diesel", "Electric", "Hybrid"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Semi-Automatic", "Automatic"],
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Car = new mongoose.model("Car", carSchema);
