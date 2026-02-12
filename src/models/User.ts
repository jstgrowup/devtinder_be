import mongoose, { Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser } from "../types";
interface IUserMethods {
  getJwt(): Promise<string>;
  validatePass(inputPass: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 40,
      trim: true,
    },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not a valid gender",
      },
    },
    about: { type: String, default: "Default about" },
    photoUrl: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png",
    },
    skills: { type: [String], validate: (v: string) => v.length <= 10 },
  },
  { timestamps: true },
);

userSchema.index({ firstName: 1, lastName: 1 });
userSchema.methods.getJwt = async function () {
  const user = this;
  return await jwt.sign({ _id: user._id }, "DEV@TINDER", {
    expiresIn: "1d",
  });
};
userSchema.methods.validatePass = async function (inputPass: string) {
  const passwordHash = this.password;

  return await bcrypt.compare(inputPass, passwordHash);
};
export const User = mongoose.model("User", userSchema);
