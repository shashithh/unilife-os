const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["Student", "Counselor", "Admin"],
      default: "Student",
    },

    // Optional fields (useful for Student)
    studentId: { type: String, default: "" },

    // Optional fields (useful for Counselor)
    specialization: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);