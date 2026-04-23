const mongoose = require("mongoose");

const stressEntrySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

stressEntrySchema.index({ student: 1, date: 1 });

module.exports = mongoose.model("StressEntry", stressEntrySchema);
