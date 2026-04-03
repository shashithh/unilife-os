const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, major, year } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: "Name, email and password are required" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "Email already registered" });

        const user = await User.create({ name, email, password, major, year });
        const token = signToken(user._id);

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, major: user.major, year: user.year },
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ error: "Invalid email or password" });

        const token = signToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, major: user.major, year: user.year },
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (e) { res.status(500).json({ error: e.message }); }
};
