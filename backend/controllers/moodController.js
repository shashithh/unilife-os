const MoodEntry = require("../models/MoodEntry");

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

exports.addOrUpdateMood = async (req, res) => {
  try {
    console.log("[DEBUG Backend] Authenticated User:", req.user);
    console.log("[DEBUG Backend] Request Body:", req.body);
    
    const { mood, note } = req.body;
    const studentId = req.user.id;
    const today = getStartOfToday();

    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    let entry = await MoodEntry.findOne({
      student: studentId,
      date: today,
    });

    if (entry) {
      entry.mood = mood;
      if (note !== undefined) entry.note = note;
      const saved = await entry.save();
      console.log("[DEBUG Backend] Updated existing entry:", saved);
    } else {
      entry = await MoodEntry.create({
        student: studentId,
        mood,
        note,
        date: today,
      });
      console.log("[DEBUG Backend] Created new entry:", entry);
    }

    console.log("[DEBUG Backend] Save Success! Returning 200 OK");
    res.status(200).json(entry);
  } catch (error) {
    console.error("Error saving mood:", error);
    res.status(500).json({ error: "Server error saving mood" });
  }
};

exports.getTodayMood = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = getStartOfToday();

    const entry = await MoodEntry.findOne({
      student: studentId,
      date: today,
    });

    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching today's mood" });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const entries = await MoodEntry.find({ student: studentId })
      .sort({ date: -1 })
      .limit(7);

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching mood history" });
  }
};
