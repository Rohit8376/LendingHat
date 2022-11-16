const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      min: 3,
      max: 15,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    profile_pic: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: true,
    },

    message: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    dob: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      trim: true,
      enum: [`male`, `female`],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
