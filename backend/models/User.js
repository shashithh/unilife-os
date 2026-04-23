const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["Student", "Counselor", "Admin"],
      default: "Student",
    },

<<<<<<< HEAD
    // Student
    studentId: { type: String, default: "" },

    // Counselor
    specialization: { type: String, default: "" },
    displayName: { type: String, default: "" },
    workEmail: { type: String, default: "" },
    phone: { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
    consultationMode: { type: String, default: "Both" },
    showFullName: { type: String, enum: ["Yes", "No"], default: "No" },
    allowDirectContact: { type: String, enum: ["Yes", "No"], default: "No" },
    profileVisibility: {
      type: String,
      default: "Students can view limited profile",
    },
    confidentialityAccepted: { type: Boolean, default: false },

    // Existing counselor profile fields
=======
    // Student fields
    studentId: { type: String, default: "" },

    // Counselor fields
    specialization: { type: String, default: "" },
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
    bio: { type: String, default: "" },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Unavailable", "Busy"],
      default: "Available",
    },
<<<<<<< HEAD
    counselingModes: { type: [String], default: ["Online", "In-person"] },
    profileImage: { type: String, default: "" },
=======
    counselingModes: {
      type: [String],
      default: ["Online", "In-person"],
    },
    profileImage: { type: String, default: "" },

    // New privacy/professional fields for counselor
    displayName: { type: String, default: "", trim: true },
    workEmail: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    licenseNumber: { type: String, default: "", trim: true },
    experienceYears: { type: Number, default: 0 },
    consultationMode: {
      type: String,
      enum: ["Online", "Physical", "Both"],
      default: "Both",
    },
    showFullName: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    allowDirectContact: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    profileVisibility: {
      type: String,
      enum: [
        "Students can view limited profile",
        "Only admin can view full profile",
      ],
      default: "Students can view limited profile",
    },
    confidentialityAccepted: {
      type: Boolean,
      default: false,
    },
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);