const express = require("express");
const router = express.Router();
const {
  addOrUpdateMood,
  getTodayMood,
  getMoodHistory,
} = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addOrUpdateMood);
router.get("/today", protect, getTodayMood);
router.get("/", protect, getMoodHistory);

module.exports = router;
