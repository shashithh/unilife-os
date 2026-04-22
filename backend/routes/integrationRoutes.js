const express = require("express");
const router = express.Router();
const { getStudentOverview } = require("../controllers/integrationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/student-overview", protect, getStudentOverview);

module.exports = router;
