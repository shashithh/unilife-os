const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ✅ Register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role, studentId, specialization } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "❌ Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: role || "Student",
      studentId: studentId || "",
      specialization: specialization || "",
    });

    const token = signToken(user);

    res.status(201).json({
      message: "✅ Registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🛠️ DEV BYPASS: Allow login without DB
    if (email === "dev@unilife.com" && password === "dev123") {
      const mockUser = { _id: "000000000000000000000000", fullName: "Dev User", email: "dev@unilife.com", role: "Admin" };
      const token = signToken(mockUser);
      return res.json({
        message: "✅ Dev Login success",
        token,
        user: { id: mockUser._id, fullName: mockUser.fullName, email: mockUser.email, role: mockUser.role },
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "❌ Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "❌ Invalid credentials" });

    const token = signToken(user);

    res.json({
      message: "✅ Login success",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get my profile (protected)
exports.me = async (req, res) => {
  try {
    // 🛠️ DEV BYPASS: Return mock user if ID matches dev ID
    if (req.user.id === "000000000000000000000000") {
      return res.json({ id: "000000000000000000000000", fullName: "Dev User", email: "dev@unilife.com", role: "Admin" });
    }

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: err.message });
  }
};