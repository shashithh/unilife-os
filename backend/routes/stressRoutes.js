const express = require("express");
const router = express.Router();
const {
  addOrUpdateStress,
  getTodayStress,
  getStressHistory,
} = require("../controllers/stressController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addOrUpdateStress);
router.get("/today", protect, getTodayStress);
router.get("/", protect, getStressHistory);

module.exports = router;
