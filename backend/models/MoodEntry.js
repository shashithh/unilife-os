const mongoose = require("mongoose");

const moodEntrySchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true }, // or ObjectId if you have auth
    date: { type: String, required: true }, // "YYYY-MM-DD"
    mood: { type: String, required: true }, // Happy/Sad/Angry/Neutral etc
    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// one mood entry per day per student
moodEntrySchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MoodEntry", moodEntrySchema);