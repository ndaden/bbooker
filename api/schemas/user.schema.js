const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  uniqueValidator = require("mongoose-unique-validator");

const Point = require("./point.schema");
const Email = new Schema({
  address: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  // Change the default to true if you don't need to validate a new user's email address
  validated: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: { type: Email, required: true },
    roles: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Role",
      },
    ],
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String,
      address: {
        street1: String,
        street2: String,
        city: String,
        state: String,
        country: String,
        zip: String,
        location: {
          type: Point,
          required: false,
        },
      },
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
