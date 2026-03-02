const Task = require("../models/Task");
const { startOfDay } = require("../utils/dateUtils");

exports.getCalendar = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const filter = {};

        if (from || to) {
            filter.scheduledDate = {};
            if (from) filter.scheduledDate.$gte = startOfDay(new Date(from));
            if (to) filter.scheduledDate.$lte = startOfDay(new Date(to));
        }

        const tasks = await Task.find(filter).populate("subject").sort({ scheduledDate: 1 });

        // Calendar-friendly format
        const events = tasks.map(t => ({
            id: t._id,
            title: t.title,
            date: t.scheduledDate,
            deadline: t.deadline,
            priority: t.priority,
            status: t.status,
            riskLevel: t.riskLevel,
            subject: t.subject ? { name: t.subject.name, color: t.subject.color } : null
        }));

        res.json(events);
    } catch (e) { next(e); }
};