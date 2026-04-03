const Project = require("../models/Project");

const ALLOWED_FIELDS = ["name", "description", "deadline", "detectedType", "members", "functions", "milestones", "dashboard"];

function whitelist(body) {
    const data = {};
    for (const key of ALLOWED_FIELDS) {
        if (body[key] !== undefined) data[key] = body[key];
    }
    return data;
}

// POST /api/projects
exports.createProject = async (req, res) => {
    try {
        const data = whitelist(req.body);
        data.createdBy = req.user._id;
        if (!data.name) return res.status(400).json({ error: "Project name is required" });
        if (!data.deadline) return res.status(400).json({ error: "Deadline is required" });
        const project = await Project.create(data);
        res.status(201).json(project);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /api/projects — only projects the user owns or is a member of
exports.getProjects = async (req, res) => {
    try {
        const userId = String(req.user._id);
        const projects = await Project.find({
            $or: [
                { createdBy: req.user._id },
                { "members.id": userId }
            ]
        }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /api/projects/:id
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (e) {
        if (e.name === "CastError") return res.status(400).json({ error: "Invalid project ID" });
        res.status(500).json({ error: e.message });
    }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
    try {
        const data = whitelist(req.body);
        const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (e) {
        if (e.name === "CastError") return res.status(400).json({ error: "Invalid project ID" });
        res.status(500).json({ error: e.message });
    }
};

// PATCH /api/projects/:id/milestones/:milestoneId  — update status + notes
exports.updateMilestone = async (req, res) => {
    try {
        const { id, milestoneId } = req.params;
        const { status, note } = req.body;

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const ms = project.milestones.find(m => m.id === milestoneId);
        if (!ms) return res.status(404).json({ error: "Milestone not found" });

        if (status) ms.status = status;
        if (note)   ms.notes.push(note);

        await project.save();
        res.json(project);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
