const express = require("express");
const router = express.Router();
const ai = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

// Step 1 — validate project input
router.post("/validate", ai.validateProject);

// Step 2 — suggest functions after validation
router.post("/suggest-functions", ai.suggestFunctions);

// Step 3 — generate milestones after role assignment
router.post("/milestones", ai.generateMilestones);

// Step 4 — seed dashboard after milestones confirmed
router.post("/dashboard", ai.generateDashboard);

// Step 5 — personal todos per member
router.post("/todos", ai.generatePersonalTodos);

// Step 6 — re-analyze on task status update
router.post("/reanalyze", ai.reAnalyzeDashboard);

// Step 7 — meeting agenda generator
router.post("/meeting-agenda", ai.generateMeetingAgenda);

module.exports = router;
