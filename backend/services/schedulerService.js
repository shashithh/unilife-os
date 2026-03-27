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

    } catch {
        return "Unknown";
    }
};

// Productivity Score
exports.calculateProductivity = async () => {
    try {
        const tasks = await Task.find();

        const completed = tasks.filter(t => t.status === "Completed").length;
        const total = tasks.length;

        if (total === 0) return 0;

        return Math.round((completed / total) * 100);

    } catch {
        return 0;
    }
};

// Auto Reschedule Missed Tasks
exports.rescheduleMissedTasks = async () => {
    try {
        const today = new Date();

        const missedTasks = await Task.find({
            deadline: { $lt: today },
            status: "Pending"
        });

        for (let task of missedTasks) {
            // mark original missed
            task.status = "Missed";
            await task.save();

            // create new rescheduled copy
            await Task.create({
                title: task.title + " (Rescheduled)",
                deadline: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                priority: task.priority,
                estimatedHours: task.estimatedHours,
                scheduledDate: new Date() // today
            });
        }

        return missedTasks.length;
    } catch {
        return 0;
    }
};

// Generate Weekly Plan
exports.generateWeeklyPlan = async () => {
    try {
        const tasks = await Task.find({ status: "Pending" });

        const priorityOrder = { High: 1, Medium: 2, Low: 3 };

        return tasks.sort((a, b) => {
            if (a.priority === b.priority) {
                return new Date(a.deadline) - new Date(b.deadline);
            }

            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

    } catch {
        return [];
    }
};
