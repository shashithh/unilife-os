const Task = require("../models/Task");
const Availability = require("../models/Availability");
const { isPastDate, startOfDay } = require("../utils/dateUtils");
const { computeRisk } = require("../services/riskService");
const { generateWeeklyPlan } = require("../services/schedulerService");

function validatePriority(p) {
    return ["High", "Medium", "Low"].includes(p);
}

// Create task
exports.addTask = async (req, res, next) => {
    try {
        const { subject, title, deadline, priority, estimatedHours, scheduledDate, reminderAt } = req.body;

        // RULE: must have deadline
        if (!deadline) return res.status(400).json({ error: "Deadline is required" });

        // RULE: past dates invalid (deadline)
        if (isPastDate(deadline)) return res.status(400).json({ error: "Past deadline dates are invalid" });

        // RULE: priority enum
        if (!validatePriority(priority)) {
            return res.status(400).json({ error: "Priority must be High / Medium / Low" });
        }

        // default scheduledDate = today
        const sch = scheduledDate ? new Date(scheduledDate) : startOfDay(new Date());

        const task = await Task.create({
            subject,
            title,
            deadline,
            priority,
            estimatedHours: estimatedHours ?? 1,
            scheduledDate: sch,
            reminderAt
        });

        // compute risk now (basic: assume completionRate 0.7 for now)
        task.riskLevel = computeRisk({ deadline: task.deadline, priority: task.priority, completionRate: 0.7 });
        await task.save();

        res.status(201).json(task);
    } catch (e) { next(e); }
};

// List tasks
exports.getTasks = async (req, res, next) => {
    try {
        const { status, from, to, subject } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (subject) filter.subject = subject;

        if (from || to) {
            filter.scheduledDate = {};
            if (from) filter.scheduledDate.$gte = startOfDay(new Date(from));
            if (to) filter.scheduledDate.$lte = startOfDay(new Date(to));
        }

        const tasks = await Task.find(filter).populate("subject").sort({ scheduledDate: 1, deadline: 1 });
        res.json(tasks);
    } catch (e) { next(e); }
};

// Mark completed
exports.completeTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.status = "Completed";
        task.completedAt = new Date();
        await task.save();

        res.json(task);
    } catch (e) { next(e); }
};

// Auto-reschedule missed tasks
exports.autoReschedule = async (req, res, next) => {
    try {
        const now = new Date();

        // pending but deadline passed => missed
        const missed = await Task.find({
            status: "Pending",
            deadline: { $lt: now }
        });

        // mark missed + move scheduledDate to today+1 (simple)
        const tomorrow = startOfDay(new Date());
        tomorrow.setDate(tomorrow.getDate() + 1);

        for (const t of missed) {
            t.status = "Missed";
            // Create a new "retry" task (lecturer likes this)
            await Task.create({
                subject: t.subject,
                title: `${t.title} (Rescheduled)`,
                deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // new deadline +3 days
                priority: t.priority,
                estimatedHours: t.estimatedHours,
                scheduledDate: tomorrow,
                riskLevel: "High"
            });
            await t.save();
        }

        res.json({ missedCount: missed.length, message: "Auto-reschedule completed" });
    } catch (e) { next(e); }
};

// AI weekly plan
exports.weeklyPlan = async (req, res, next) => {
    try {
        const tasks = await Task.find({ status: "Pending" }).sort({ deadline: 1 });
        let availability = await Availability.findOne();
        if (!availability) availability = await Availability.create({});

        const plan = generateWeeklyPlan({ tasks, hoursByDay: availability.hoursByDay });
        res.json(plan);
    } catch (e) { next(e); }
};