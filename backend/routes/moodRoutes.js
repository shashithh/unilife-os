const express = require("express");
const router = express.Router();
const moodController = require("../controllers/moodController");

router.post("/", moodController.addMood);
router.get("/:studentId", moodController.getMoodHistory);

module.exports = router;