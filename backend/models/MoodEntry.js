const mongoose = require("mongoose");

const moodEntrySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ["happy", "calm", "neutral", "stressed", "sad", "overwhelmed"],
    },
    note: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
      // Default to start of day
    },
  },
  { 
    timestamps: true,
    collection: "moodentries" 
  }
);

// Compound index to quickly find a student's entry for a specific date
moodEntrySchema.index({ student: 1, date: 1 });

module.exports = mongoose.model("MoodEntry", moodEntrySchema);
