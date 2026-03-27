const router = require("express").Router();
const c = require("../controllers/taskController");

router.post("/", c.addTask);
router.get("/", c.getTasks);

router.put("/:id/complete", c.completeTask);

router.get("/weekly-plan", c.weeklyPlan);
router.put("/auto-reschedule", c.autoReschedule);

module.exports = router;