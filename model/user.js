const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
  fullname: String,
  mobile: String,
  village: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Village",
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // basic email validation
  },
  image: {
    type: String
  },
  role: {
    type: String,
    default: "user"
  },
  resetToken: String,
  resetTokenExpiry: Date
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
