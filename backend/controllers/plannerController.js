const Task = require("../models/Task");
const scheduler = require("../services/schedulerService");

// Add new task
exports.addTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);

        const risk = scheduler.detectRisk(task);

        res.json({
            message: "Task Created",
            task,
            riskLevel: risk
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Weekly Plan
exports.getWeeklyPlan = async (req, res) => {
    try {
        const plan = await scheduler.generateWeeklyPlan();

        res.json(plan);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Productivity Score
exports.getProductivity = async (req, res) => {
    try {
        const score = await scheduler.calculateProductivity();

        res.json({ productivityScore: score });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Run Auto-Reschedule
exports.autoReschedule = async (req, res) => {
    try {
        const updatedCount = await scheduler.rescheduleMissedTasks();

        res.json({ rescheduledTasks: updatedCount });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
