const Counselor = require("../models/Counselor");

exports.addCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.create(req.body);
    res.status(201).json({ message: "✅ Counselor added", counselor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find();
    res.json(counselors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};