const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, projectController.getProjects);
router.post("/", protect, projectController.createProject);
router.get("/:id", protect, projectController.getProjectById);

module.exports = router;
