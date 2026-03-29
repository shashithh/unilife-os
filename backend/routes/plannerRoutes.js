const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getProductivity,
    getWeeklyPlan,
    runAIAnalysis,
    getAlertsSummary
} = require("../controllers/plannerController");

router.get("/dashboard", getDashboard);
router.get("/productivity", getProductivity);
router.get("/weekly-plan", getWeeklyPlan);
router.post("/ai-scheduler/run", runAIAnalysis);
router.get("/alerts-summary", getAlertsSummary);

module.exports = router;