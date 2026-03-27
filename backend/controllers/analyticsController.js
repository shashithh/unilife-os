const Task = require("../models/Task");
const { computeProductivity } = require("../services/productivityService");
const { computeRisk } = require("../services/riskService");

exports.productivity = async (req, res, next) => {
    try {
        const completedCount = await Task.countDocuments({ status: "Completed" });
        const missedCount = await Task.countDocuments({ status: "Missed" });
        const pendingCount = await Task.countDocuments({ status: "Pending" });

        const result = computeProductivity({ completedCount, missedCount, pendingCount });
        res.json({ completedCount, missedCount, pendingCount, ...result });
    } catch (e) { next(e); }
};

exports.refreshRisk = async (req, res, next) => {
    try {
        const tasks = await Task.find({ status: "Pending" });

        // naive completionRate estimate from history
        const completedCount = await Task.countDocuments({ status: "Completed" });
        const totalDone = await Task.countDocuments({ status: { $in: ["Completed", "Missed"] } });
        const completionRate = totalDone === 0 ? 0.7 : completedCount / totalDone;

        for (const t of tasks) {
            t.riskLevel = computeRisk({ deadline: t.deadline, priority: t.priority, completionRate });
            await t.save();
        }

        res.json({ updated: tasks.length, completionRate });
    } catch (e) { next(e); }
};