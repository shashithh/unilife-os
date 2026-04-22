const Task = require("../models/Task");
const CalendarEvent = require("../models/CalendarEvent");

const getEvents = async (req, res) => {
    try {
        const manualEvents = await CalendarEvent.find({ userId: req.user.id }).sort({ date: 1 });

        const tasks = await Task.find({ userId: req.user.id, status: { $ne: "Completed" } })
            .populate("subjectId")
            .sort({ deadline: 1 });

        const taskEvents = tasks.map((task) => {
            let color = "bg-blue-100 text-blue-700 border-blue-200";

            if (task.priority === "High") {
                color = "bg-red-100 text-red-700 border-red-200";
            } else if (task.priority === "Medium") {
                color = "bg-orange-100 text-orange-700 border-orange-200";
            } else if (task.priority === "Low") {
                color = "bg-green-100 text-green-700 border-green-200";
            }

            return {
                _id: `task-${task._id}`,
                title: `${task.subjectId?.subjectCode || ""} ${task.title}`.trim(),
                date: task.deadline,
                time: "11:59 PM",
                type: "task",
                color,
                subjectCode: task.subjectId?.subjectCode || "",
                priority: task.priority,
                source: "task"
            };
        });

        res.json([...manualEvents, ...taskEvents]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addEvent = async (req, res) => {
    try {
        const { title, date, time, type } = req.body;

        if (!title || !date || !time || !type) {
            return res.status(400).json({ message: "All event fields are required" });
        }

        let color = "bg-blue-100 text-blue-700 border-blue-200";
        if (type === "exam") color = "bg-red-100 text-red-700 border-red-200";
        if (type === "study") color = "bg-purple-100 text-purple-700 border-purple-200";
        if (type === "assignment") color = "bg-orange-100 text-orange-700 border-orange-200";

        const event = await CalendarEvent.create({
            userId: req.user.id,
            title,
            date,
            time,
            type,
            color
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    addEvent
};