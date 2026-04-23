const express = require("express");
const router = express.Router();
const counselorController = require("../controllers/counselorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", counselorController.getAllCounselors);
<<<<<<< HEAD
=======
router.put("/profile", protect, counselorController.updateProfile);
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
router.get("/:id", counselorController.getCounselorById);
router.get("/:id/slots", counselorController.getCounselorSlots);

module.exports = router;
