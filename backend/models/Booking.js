const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    counselor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    sessionMode: { type: String, enum: ["Online", "In-person"], default: "Online" },
    reason: { type: String, default: "" },
    urgency: { type: String, enum: ["Normal", "High", "Critical"], default: "Normal" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
