const mongoose = require("mongoose");

const counselorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, default: "General" },
    availableSlots: [
      {
        date: String, // "YYYY-MM-DD"
        time: String, // "14:00"
        isBooked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counselor", counselorSchema);