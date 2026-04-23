const Project = require("../models/Project");

// GET /api/projects — list projects for user
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({
      $or: [{ owner: userId }, { "members.userId": userId }]
    }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /api/projects — create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, deadline, priority } = req.body;
    const project = await Project.create({
      name,
      description,
      deadline,
      priority,
      owner: req.user.id,
      members: [{ userId: req.user.id, name: req.user.fullName, role: "Owner" }],
      milestones: [
        { title: "Define Project Goals", status: "pending", dueDate: deadline },
        { title: "Team Alignment", status: "pending", dueDate: deadline }
      ]
    });
    res.status(201).json(project);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// GET /api/projects/:id — get single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (e) {
    res.status(400).json({ error: "Invalid ID" });
  }
};
