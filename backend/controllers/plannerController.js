const Task = require("../models/Task");
const scheduler = require("../services/schedulerService");

// ✅ Business rule helpers
const isPastDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
};

// ✅ Add new task (with validations)
exports.addTask = async (req, res) => {
    try {
        const { title, deadline, priority, estimatedHours, scheduledDate, startTime, endTime } = req.body;

        // ✅ RULE 1: Cannot add without deadline
        if (!deadline) {
            return res.status(400).json({ error: "Deadline is required" });
        }

        // ✅ RULE 2: Past dates invalid (deadline)
        if (isPastDate(deadline)) {
            return res.status(400).json({ error: "Past deadline date is invalid" });
        }

        // ✅ RULE 3: Priority must be High/Medium/Low
        if (!["High", "Medium", "Low"].includes(priority)) {
            return res.status(400).json({ error: "Priority must be High / Medium / Low" });
        }

        // ✅ Calendar: if scheduledDate not provided, use today
        const sd = scheduledDate ? new Date(scheduledDate) : new Date();
        sd.setHours(0, 0, 0, 0);

        const task = await Task.create({
            title,
            deadline,
            priority,
            estimatedHours: estimatedHours ?? 1,
            scheduledDate: sd,
            startTime: startTime ?? "18:00",
            endTime: endTime ?? "19:00",
        });

        const risk = scheduler.detectRisk(task);

        res.status(201).json({
            message: "Task Created",
            task,
            riskLevel: risk,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ UPDATE TASK (NEW) - edit title/deadline/priority/scheduledDate/time/status etc.
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // ✅ validate if changing deadline
        if (updates.deadline) {
            if (isPastDate(updates.deadline)) {
                return res.status(400).json({ error: "Past deadline date is invalid" });
            }
        }

        // ✅ validate if changing priority
        if (updates.priority && !["High", "Medium", "Low"].includes(updates.priority)) {
            return res.status(400).json({ error: "Priority must be High / Medium / Low" });
        }

        // ✅ normalize scheduledDate for calendar
        if (updates.scheduledDate) {
            const sd = new Date(updates.scheduledDate);
            sd.setHours(0, 0, 0, 0);
            updates.scheduledDate = sd;
        }

        const task = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (!task) return res.status(404).json({ error: "Task not found" });

        const risk = scheduler.detectRisk(task);

        res.json({
            message: "Task Updated",
            task,
            riskLevel: risk,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all tasks (REAL DB DATA)
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ scheduledDate: 1, deadline: 1 });
        res.json({ count: tasks.length, tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Calendar tasks between dates (for month/week view)
exports.getCalendarTasks = async (req, res) => {
    try {
        const { from, to } = req.query;

        const filter = {};
        if (from && to) {
            filter.scheduledDate = {
                $gte: new Date(from),
                $lte: new Date(to),
            };
        }

        const tasks = await Task.find(filter).sort({ scheduledDate: 1 });

        // Calendar format
        const events = tasks.map((t) => ({
            id: t._id,
            title: t.title,
            date: t.scheduledDate,
            startTime: t.startTime,
            endTime: t.endTime,
            deadline: t.deadline,
            priority: t.priority,
            status: t.status,
            riskLevel: scheduler.detectRisk(t),
        }));

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Mark complete
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.status = "Completed";
        await task.save();

        res.json({ message: "Task completed", task });
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