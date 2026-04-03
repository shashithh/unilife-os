const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

router.use(protect);

// GET /api/users/lookup/:id  — look up a user by their MongoDB _id
router.get("/lookup/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("_id name email major year");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ id: user._id, name: user.name, email: user.email, major: user.major, year: user.year });
    } catch {
        res.status(400).json({ error: "Invalid user ID format" });
    }
});

// GET /api/users  — list all users (for dev/testing — shows IDs to copy)
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("_id name email major year").limit(50);
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
