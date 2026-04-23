const mongoose = require("mongoose");

const functionSchema = new mongoose.Schema({
  id:              String,
  name:            String,
  description:     String,
  suggestedRole:   String,
  estimatedEffort: String,
  assignedTo:      String,
  assignedUserId:  String,
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  id:              String,
  title:           String,
  date:            String,
  description:     String,
  linkedFunctions: [String],
  isCritical:      Boolean,
  status:          { type: String, default: "pending" },
  notes:           [{ text: String, author: String, time: String }],
}, { _id: false });

const memberSchema = new mongoose.Schema({
  id:    String,
  name:  String,
  email: String,
  major: String,
}, { _id: false });

const projectSchema = new mongoose.Schema({
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name:         { type: String, required: true },
  description:  { type: String, default: "" },
  deadline:     { type: Date, required: true },
  detectedType: { type: String, default: "Other" },
  members:      [memberSchema],
  functions:    [functionSchema],
  milestones:   [milestoneSchema],
  dashboard:    { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
