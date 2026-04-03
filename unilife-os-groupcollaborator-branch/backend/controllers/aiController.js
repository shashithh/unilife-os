const gemini = require("../services/geminiPrompts");

exports.validateProject = async (req, res) => {
    try {
        console.log("called")
        const result = await gemini.validateProject(req.body);
        console.log(result)
        res.json(result);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

exports.suggestFunctions = async (req, res) => {
    try {
        const result = await gemini.suggestFunctions(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateMilestones = async (req, res) => {
    try {
        const result = await gemini.generateMilestones(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateDashboard = async (req, res) => {
    try {
        const result = await gemini.generateDashboard(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generatePersonalTodos = async (req, res) => {
    try {
        const result = await gemini.generatePersonalTodos(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.reAnalyzeDashboard = async (req, res) => {
    try {
        const result = await gemini.reAnalyzeDashboard(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateMeetingAgenda = async (req, res) => {
    try {
        const result = await gemini.generateMeetingAgenda(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
