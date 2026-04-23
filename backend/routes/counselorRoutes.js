const express = require("express");
const router = express.Router();
const counselorController = require("../controllers/counselorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", counselorController.getAllCounselors);
router.put("/profile", protect, counselorController.updateProfile);
router.get("/:id", counselorController.getCounselorById);
router.get("/:id/slots", counselorController.getCounselorSlots);

module.exports = router;
