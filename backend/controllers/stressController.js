const StressEntry = require("../models/StressEntry");

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

exports.addOrUpdateStress = async (req, res) => {
  try {
    const { stressLevel, note } = req.body;
    const studentId = req.user.id;
    const today = getStartOfToday();

    if (!stressLevel || stressLevel < 1 || stressLevel > 5) {
      return res.status(400).json({ error: "Valid stressLevel (1-5) is required" });
    }

    let entry = await StressEntry.findOne({
      student: studentId,
      date: today,
    });

    if (entry) {
      entry.stressLevel = stressLevel;
      if (note !== undefined) entry.note = note;
      await entry.save();
    } else {
      entry = await StressEntry.create({
        student: studentId,
        stressLevel,
        note,
        date: today,
      });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("Error saving stress:", error);
    res.status(500).json({ error: "Server error saving stress level" });
  }
};

exports.getTodayStress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = getStartOfToday();

    const entry = await StressEntry.findOne({
      student: studentId,
      date: today,
    });

    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching today's stress" });
  }
};

exports.getStressHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const entries = await StressEntry.find({ student: studentId })
      .sort({ date: -1 })
      .limit(7);

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching stress history" });
  }
};
