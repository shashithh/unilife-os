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
<<<<<<< HEAD
    const { fullName, email, password, role, studentId, specialization } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "❌ Email already exists" });
=======
    const {
      fullName,
      email,
      password,
      role,
      studentId,
      specialization,

      // new counselor privacy fields
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

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Full name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "❌ Email already exists" });
    }

    // Counselor validations
    if (role === "Counselor") {
      if (!specialization || !specialization.trim()) {
        return res.status(400).json({ error: "Specialization is required for counselors" });
      }

      if (!displayName || !displayName.trim()) {
        return res.status(400).json({ error: "Display name is required for counselors" });
      }

      if (!licenseNumber || !licenseNumber.trim()) {
        return res.status(400).json({ error: "License number is required for counselors" });
      }

      if (!confidentialityAccepted) {
        return res.status(400).json({
          error: "You must accept the confidentiality agreement",
        });
      }
    
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: role || "Student",
<<<<<<< HEAD
      studentId: studentId || "",
      specialization: specialization || "",
=======

      // student
      studentId: role === "Student" ? (studentId || "") : "",

      // counselor basic
      specialization: role === "Counselor" ? (specialization || "") : "",

      // counselor privacy/professional fields
      displayName: role === "Counselor" ? (displayName || "") : "",
      workEmail: role === "Counselor" ? (workEmail || "") : "",
      phone: role === "Counselor" ? (phone || "") : "",
      licenseNumber: role === "Counselor" ? (licenseNumber || "") : "",
      experienceYears: role === "Counselor" ? Number(experienceYears || 0) : 0,
      consultationMode: role === "Counselor" ? (consultationMode || "Both") : "Both",
      showFullName: role === "Counselor" ? (showFullName || "No") : "No",
      allowDirectContact: role === "Counselor" ? (allowDirectContact || "No") : "No",
      profileVisibility:
        role === "Counselor"
          ? (profileVisibility || "Students can view limited profile")
          : "Students can view limited profile",
      confidentialityAccepted: role === "Counselor" ? Boolean(confidentialityAccepted) : false,
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
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
<<<<<<< HEAD
=======
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
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
<<<<<<< HEAD
=======
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
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get my profile (protected)
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};