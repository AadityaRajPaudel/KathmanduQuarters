const mongoose = require("mongoose");

// user details schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.mykhel.com/thumb/250x90x250/football/players/4/19054.jpg",
    },
  },
  { timestamps: true }
);

// each document in User collection will adhere to the defined userSchema
const User = mongoose.model("User", userSchema);

module.exports = User;
// now we can use this schema anywhere in the project
