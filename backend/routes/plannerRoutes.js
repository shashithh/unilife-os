const express = require("express");
const router = express.Router();
const plannerController = require("../controllers/plannerController");


// ✅ ROOT ROUTE (so /api/planner works)
router.get("/", (req, res) => {
    res.json({
        message: "Planner API working ✅",
        endpoints: {
            createTask: "POST /api/planner/tasks",
            getTasks: "GET /api/planner/tasks",
            updateTask: "PUT /api/planner/tasks/:id",
            completeTask: "PUT /api/planner/tasks/:id/complete",
            calendar: "GET /api/planner/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD",
            weeklyPlan: "GET /api/planner/weekly-plan",
            productivity: "GET /api/planner/productivity",
            autoReschedule: "PUT /api/planner/auto-reschedule"
        }
    });
});


// ✅ Create + Get tasks
router.post("/tasks", plannerController.addTask);
router.get("/tasks", plannerController.getTasks);

// ✅ Update task
router.put("/tasks/:id", plannerController.updateTask);

// ✅ Complete task
router.put("/tasks/:id/complete", plannerController.completeTask);

// ✅ Calendar endpoint
router.get("/calendar", plannerController.getCalendarTasks);

// ✅ Smart features
router.get("/weekly-plan", plannerController.getWeeklyPlan);
router.get("/productivity", plannerController.getProductivity);
router.put("/auto-reschedule", plannerController.autoReschedule);

module.exports = router;