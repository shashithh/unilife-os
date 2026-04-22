const Task = require("../models/Task");
const Subject = require("../models/Subject");
const {
    getRiskLevel,
    calculateProductivity,
    generateWeeklyPlan,
    getAlertSummary
} = require("../services/plannerService");

const getDashboard = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).populate("subjectId");

        const pendingTasks = tasks.filter((t) => t.status !== "Completed");
        const criticalTasks = tasks.filter(
            (t) => t.risk === "Critical" && t.status !== "Completed"
        );

        const productivity = calculateProductivity(tasks);

        res.json({
            pendingTasks: pendingTasks.length,
            criticalRisk: criticalTasks.length,
            productivityScore: productivity.score,
            studyStreak: productivity.streakDays
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductivity = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).populate("subjectId");
        const stats = calculateProductivity(tasks);

        const weeklyTrend = [
            { name: "Mon", hours: 4, completed: 2 },
            { name: "Tue", hours: 6, completed: 4 },
            { name: "Wed", hours: 5, completed: 3 },
            { name: "Thu", hours: 3, completed: 1 },
            { name: "Fri", hours: 7, completed: 5 },
            { name: "Sat", hours: 2, completed: 0 },
            { name: "Sun", hours: 1, completed: 0 }
        ];

        const subjectMap = {};
        tasks.forEach((task) => {
            const name = task.subjectId?.subjectName || "Unknown";
            if (!subjectMap[name]) subjectMap[name] = 0;
            subjectMap[name] += Number(task.estimatedHours || 0);
        });

        const totalHours = Object.values(subjectMap).reduce((a, b) => a + b, 0);

        const subjectFocus = Object.entries(subjectMap).map(([name, hours]) => ({
            name,
            value: totalHours ? Math.round((hours / totalHours) * 100) : 0
        }));

        res.json({
            ...stats,
            weeklyTrend,
            subjectFocus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWeeklyPlan = async (req, res) => {
    try {
        const tasks = await Task.find({
            userId: req.user.id,
            status: { $ne: "Completed" }
        })
            .populate("subjectId")
            .sort({ deadline: 1 });

        const subjects = await Subject.find({ userId: req.user.id });

        const weeklyPlan = generateWeeklyPlan(tasks, subjects);
        res.json(weeklyPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const runAIAnalysis = async (req, res) => {
    try {
        const tasks = await Task.find({
            userId: req.user.id,
            status: { $ne: "Completed" }
        });

        if (!tasks || tasks.length === 0) {
            return res.json({
                message: "No pending tasks found to analyze.",
                tasksRescheduled: 0,
                studyBlocksAdded: 0,
                productivityGain: 0,
                recommendation: "Add tasks first"
            });
        }

        let rescheduledCount = 0;

        for (const task of tasks) {
            const currentRisk = getRiskLevel(task.deadline, task.priority);

            if (currentRisk === "Critical") {
                const newDate = new Date(task.deadline);
                newDate.setDate(newDate.getDate() + 1);
                task.deadline = newDate;
                rescheduledCount++;
            }

            task.risk = getRiskLevel(task.deadline, task.priority);
            await task.save();
        }

        const updatedTasks = await Task.find({
            userId: req.user.id,
            status: { $ne: "Completed" }
        }).populate("subjectId");

        const subjects = await Subject.find({ userId: req.user.id });
        const weeklyPlan = generateWeeklyPlan(updatedTasks, subjects);

        const studyBlocksAdded = Object.values(weeklyPlan).reduce(
            (sum, dayItems) => sum + dayItems.length,
            0
        );

        return res.json({
            message: "A new study plan has been created based on your highest priorities.",
            tasksRescheduled: rescheduledCount,
            studyBlocksAdded,
            productivityGain: studyBlocksAdded > 0 ? 12 : 0,
            recommendation: "Weekly Plan Generated"
        });
    } catch (error) {
        console.error("runAIAnalysis error:", error);
        return res.status(500).json({
            message: error.message || "AI analysis failed"
        });
    }
};

const getAlertsSummary = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).populate("subjectId");
        const alerts = getAlertSummary(tasks);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboard,
    getProductivity,
    getWeeklyPlan,
    runAIAnalysis,
    getAlertsSummary
};