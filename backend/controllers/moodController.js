const MoodEntry = require("../models/MoodEntry");

exports.addMood = async (req, res) => {
  try {
    const { studentId, date, mood, stressLevel, note } = req.body;

    const entry = await MoodEntry.create({
      studentId,
      date,
      mood,
      stressLevel,
      note,
    });

    res.status(201).json({ message: "✅ Mood entry added", entry });
  } catch (err) {
    // duplicate key error => one entry per day
    if (err.code === 11000) {
      return res.status(400).json({ error: "❌ Only one mood entry per day allowed" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const history = await MoodEntry.find({ studentId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};