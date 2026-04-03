const Task = require("../models/Task");

// Deadline Risk Detection
exports.detectRisk = (task) => {
    try {
        const today = new Date();
        const deadline = new Date(task.deadline);

        const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

        if (diffDays <= 2 && task.priority === "High") {
            return "Critical";
        }

        if (diffDays <= 5) {
            return "Warning";
        }

        return "Safe";

    } catch (err) {
        console.error("detectRisk error:", err.message);
        return "Unknown";
    }
};

// Productivity Score (per user)
exports.calculateProductivity = async (userId) => {
    try {
        const filter = userId ? { userId } : {};
        const tasks = await Task.find(filter);

        const completed = tasks.filter(t => t.status === "Completed").length;
        const total = tasks.length;

        if (total === 0) return 0;

        return Math.round((completed / total) * 100);

    } catch (err) {
        console.error("calculateProductivity error:", err.message);
        return 0;
    }
};

// Auto Reschedule Missed Tasks (per user)
exports.rescheduleMissedTasks = async (userId) => {
    try {
        const today = new Date();
        const filter = {
            deadline: { $lt: today },
            status: "Pending"
        };
        if (userId) filter.userId = userId;

        const missedTasks = await Task.find(filter);

        for (let task of missedTasks) {
            // mark original missed
            task.status = "Missed";
            await task.save();

            // create new rescheduled copy
            await Task.create({
                userId: task.userId,
                title: task.title + " (Rescheduled)",
                deadline: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                priority: task.priority,
                estimatedHours: task.estimatedHours,
                scheduledDate: new Date(),
                startTime: task.startTime,
                endTime: task.endTime
            });
        }

        return missedTasks.length;
    } catch (err) {
        console.error("rescheduleMissedTasks error:", err.message);
        return 0;
    }
};

// Generate Weekly Plan (per user)
exports.generateWeeklyPlan = async (userId) => {
    try {
        const filter = { status: "Pending" };
        if (userId) filter.userId = userId;

        const tasks = await Task.find(filter);

        const priorityOrder = { High: 1, Medium: 2, Low: 3 };

        return tasks.sort((a, b) => {
            if (a.priority === b.priority) {
                return new Date(a.deadline) - new Date(b.deadline);
            }

            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

    } catch (err) {
        console.error("generateWeeklyPlan error:", err.message);
        return [];
    }
};
