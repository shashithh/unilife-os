const MoodEntry = require("../models/MoodEntry");
const aiService = require("../services/aiService");

exports.getRiskAndRecommendations = async (req, res) => {
  try {
    const { studentId } = req.params;

    const moodHistory = await MoodEntry.find({ studentId }).sort({ date: -1 });

    const risk = aiService.calculateRisk(moodHistory);
    const recommendations = aiService.getRecommendations(risk);

    res.json({
      studentId,
      risk,
      recommendations,
      basedOnEntries: moodHistory.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};