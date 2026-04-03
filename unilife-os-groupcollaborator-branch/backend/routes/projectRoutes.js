const express = require("express");
const router = express.Router();
const {
    createProject, getProjects, getProject, updateProject, deleteProject, updateMilestone,
} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

router.post("/",                              createProject);
router.get("/",                               getProjects);
router.get("/:id",                            getProject);
router.put("/:id",                            updateProject);
router.patch("/:id/milestones/:milestoneId",  updateMilestone);
router.delete("/:id",                         deleteProject);

module.exports = router;
