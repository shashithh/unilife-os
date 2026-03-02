const express = require("express");
const router = express.Router();
const plannerController = require("../controllers/plannerController");

// Test route (important for debugging)
router.get("/tasks", (req, res) => {
    res.json({ message: "Planner tasks API working" });
});

router.post("/tasks", plannerController.addTask);
router.get("/weekly-plan", plannerController.getWeeklyPlan);
router.get("/productivity", plannerController.getProductivity);
router.put("/auto-reschedule", plannerController.autoReschedule);

module.exports = router;
