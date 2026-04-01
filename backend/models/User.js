const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Sub-schemas ──────────────────────────────────────────────

const assignmentSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  course:   { type: String },
  dueDate:  { type: Date },
  status:   { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { _id: true, timestamps: true });

const courseSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  code:       { type: String },
  instructor: { type: String },
  credits:    { type: Number, default: 3 },
  grade:      { type: String },
}, { _id: true });

const expenseSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  amount:   { type: Number, required: true },
  category: { type: String, enum: ['food', 'transport', 'study', 'entertainment', 'other'], default: 'other' },
  date:     { type: Date, default: Date.now },
}, { _id: true });

const moodLogSchema = new mongoose.Schema({
  mood:  { type: String, enum: ['great', 'good', 'okay', 'bad', 'terrible'], required: true },
  note:  { type: String },
  date:  { type: Date, default: Date.now },
}, { _id: true });

const eventSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  date:      { type: Date, required: true },
  type:      { type: String, enum: ['class', 'exam', 'social', 'personal'], default: 'personal' },
  allDay:    { type: Boolean, default: false },
}, { _id: true });

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
  type:    { type: String, enum: ['info', 'warning', 'success'], default: 'info' },
  date:    { type: Date, default: Date.now },
}, { _id: true });

// ── Main User Schema ─────────────────────────────────────────

const userSchema = new mongoose.Schema({

  // Auth & Identity
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'user'], default: 'user' },
  isActive: { type: Boolean, default: true },

  // Profile
  phone:    { type: String, default: '' },
  location: { type: String, default: '' },
  major:    { type: String, default: '' },
  year:     { type: String, default: '' },
  bio:      { type: String, default: '' },
  avatar:   { type: String, default: '' }, // URL or base64

  // Dashboard stats
  stats: {
    tasksDone:   { type: Number, default: 0 },
    studyHours:  { type: Number, default: 0 },
    dayStreak:   { type: Number, default: 0 },
  },

  // Academic Planner
  courses:     [courseSchema],
  assignments: [assignmentSchema],
  gpa:         { type: Number, default: 0 },

  // Group Collaboration
  groups: [{
    groupId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    role:     { type: String, enum: ['member', 'leader'], default: 'member' },
  }],

  // Wellbeing Hub
  wellbeing: {
    score:   { type: Number, default: 0, min: 0, max: 100 },
    moodLog: [moodLogSchema],
  },

  // Budget Manager
  budget: {
    monthly:  { type: Number, default: 0 },
    spent:    { type: Number, default: 0 },
    expenses: [expenseSchema],
  },

  // Calendar
  events: [eventSchema],

  // Notifications
  notifications: [notificationSchema],

  // Settings
  settings: {
    theme:                { type: String, enum: ['light', 'dark'], default: 'light' },
    language:             { type: String, default: 'en' },
    emailNotifications:   { type: Boolean, default: true },
    pushNotifications:    { type: Boolean, default: true },
  },

}, { timestamps: true });

// ── Password hashing ─────────────────────────────────────────

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
