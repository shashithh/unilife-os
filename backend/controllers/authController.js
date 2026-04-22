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

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      studentId,
      specialization,
      displayName,
      workEmail,
      phone,
      licenseNumber,
      experienceYears,
      consultationMode,
      showFullName,
      allowDirectContact,
      profileVisibility,
      confidentialityAccepted,
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "❌ Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const counselingModes =
      role === "Counselor"
        ? consultationMode === "Both"
          ? ["Online", "In-person"]
          : [consultationMode]
        : [];

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: role || "Student",

      studentId: role === "Student" ? studentId || "" : "",

      specialization: role === "Counselor" ? specialization || "" : "",
      displayName: role === "Counselor" ? displayName || "" : "",
      workEmail: role === "Counselor" ? workEmail || "" : "",
      phone: role === "Counselor" ? phone || "" : "",
      licenseNumber: role === "Counselor" ? licenseNumber || "" : "",
      experienceYears: role === "Counselor" ? Number(experienceYears) || 0 : 0,
      consultationMode: role === "Counselor" ? consultationMode || "Both" : "",
      showFullName: role === "Counselor" ? showFullName || "No" : "No",
      allowDirectContact: role === "Counselor" ? allowDirectContact || "No" : "No",
      profileVisibility:
        role === "Counselor"
          ? profileVisibility || "Students can view limited profile"
          : "Students can view limited profile",
      confidentialityAccepted: role === "Counselor" ? !!confidentialityAccepted : false,

      counselingModes,
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
        specialization: user.specialization,
        displayName: user.displayName,
        workEmail: user.workEmail,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        experienceYears: user.experienceYears,
        consultationMode: user.consultationMode,
        showFullName: user.showFullName,
        allowDirectContact: user.allowDirectContact,
        profileVisibility: user.profileVisibility,
        confidentialityAccepted: user.confidentialityAccepted,
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

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "❌ Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "❌ Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "❌ Invalid credentials" });

    const token = signToken(user);

    res.json({
      message: "✅ Logged in successfully",
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

// ✅ Get Current User
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      message: "✅ User retrieved",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: err.message });
  }
};