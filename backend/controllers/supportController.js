const SupportRequest = require("../models/SupportRequest");

const generateAnonymousId = () => "ANON-" + Math.random().toString(36).substring(2, 10).toUpperCase();

exports.createRequest = async (req, res) => {
  try {
    const { category, message } = req.body;

    // business rule: cannot reveal identity (basic filter)
    const forbiddenWords = ["my name is", "call me", "i am", "my student id"];
    const lower = message.toLowerCase();
    if (forbiddenWords.some(w => lower.includes(w))) {
      return res.status(400).json({ error: "❌ Anonymous post cannot reveal identity" });
    }

    const request = await SupportRequest.create({
      anonymousId: generateAnonymousId(),
      category,
      message,
    });

    res.status(201).json({ message: "✅ Support request submitted", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};