const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
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
  role: {
    type: String,
    required: true,
  },
  purchasedCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course" 
  }], 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
