const express = require("express");
const router = express.Router();
const {
    addTask,
    getTasks,
    updateTaskStatus
} = require("../controllers/taskController");

router.post("/", addTask);
router.get("/", getTasks);
router.put("/:id/status", updateTaskStatus);

module.exports = router;