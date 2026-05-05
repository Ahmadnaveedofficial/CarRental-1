import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required:false
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    cnic: {
      type: String,
      trim: true,
    },
     googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    image: {
      public_id: String,
      url: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);































// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return; // no need for next()
//   this.password = await bcrypt.hash(this.password, 10);
// });
// // userSchema.pre("save", async function(next){
// //    if (!this.isModified("password")){
// //     return next()
// //    }
// //     this.password= await bcrypt.hash(this.password,10)
// //     return next()
// // } )
// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {  //payload
//       _id: this.id,
//       name: this.name,
//       email: this.email,
//       role: this.role,
//     },
//     process.env.ACCESS_TOKEN_SECRET,   //secret key
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY, //expiry time
//     },
//   );
// };
// userSchema.methods.isPasswordCorrect = async function (password) {
//   //inko access krne ke lie user bnana pre ga
//   return await bcrypt.compare(password, this.password);
// };
// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this.id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     },
//   );
// };

// export const User = mongoose.model("User", userSchema);
