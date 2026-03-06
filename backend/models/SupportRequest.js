const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    anonymousId: { type: String, required: true }, // random generated id
    category: {
      type: String,
      enum: ["Stress", "Anxiety", "Depression", "Academic", "Other"],
      default: "Other",
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);