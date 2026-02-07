const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
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
    skills: { type: [String], validate: (v) => v.length <= 10 },
  },
  { timestamps: true },
);
userSchema.methods.getJwt = async function () {
  const user = this;
  return await jwt.sign({ _id: user._id }, "DEV@TINDER", {
    expiresIn: "1d",
  });
};
userSchema.methods.validatePass = async function (inputPass) {
  const passwordHash = this.password;
  return await bcrypt.compare(inputPass, passwordHash);
};
module.exports = mongoose.model("User", userSchema);
