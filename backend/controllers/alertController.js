const Task = require("../models/Task");
const { getAlertSummary } = require("../services/plannerService");

const getAlerts = async (req, res) => {
    try {
        const tasks = await Task.find();
        const alerts = getAlertSummary(tasks);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAlerts
};