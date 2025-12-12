const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 1 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, mingength: 6, select: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
