const Task = require("../models/Task");
const { getRiskLevel } = require("../services/plannerService");

const addTask = async (req, res) => {
    try {
        const {
            title,
            subjectId,
            deadline,
            priority,
            estimatedHours,
            description
        } = req.body;

        if (!title || !subjectId || !deadline || !priority || !estimatedHours) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const selectedDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({ message: "Deadline cannot be in the past" });
        }

        const risk = getRiskLevel(deadline, priority);

        const task = await Task.create({
            title,
            subjectId,
            deadline,
            priority,
            estimatedHours,
            description,
            risk
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const { search = "", subjectId = "", priority = "" } = req.query;

        const query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (subjectId) {
            query.subjectId = subjectId;
        }

        if (priority) {
            query.priority = priority;
        }

        const tasks = await Task.find(query)
            .populate("subjectId")
            .sort({ deadline: 1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addTask,
    getTasks,
    updateTaskStatus
};