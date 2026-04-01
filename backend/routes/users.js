const router = require('express').Router();
const User = require('../models/User');

// ── Auth ─────────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered.' });
    await User.create({ name, email, password });
    res.status(201).json({ message: 'Registered successfully.' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' });
    const { password: _, ...safe } = user.toObject();
    res.json({ user: safe });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Profile ──────────────────────────────────────────────────

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Academic Planner ─────────────────────────────────────────

// Courses
router.post('/:id/courses', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { courses: req.body } },
      { new: true }
    ).select('-password');
    res.json(user.courses);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id/courses/:courseId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { courses: { _id: req.params.courseId } } },
      { new: true }
    ).select('-password');
    res.json(user.courses);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Assignments
router.post('/:id/assignments', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { assignments: req.body } },
      { new: true }
    ).select('-password');
    res.json(user.assignments);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/assignments/:aId', async (req, res) => {
  try {
    const update = {};
    Object.keys(req.body).forEach(k => { update[`assignments.$.${k}`] = req.body[k]; });
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, 'assignments._id': req.params.aId },
      { $set: update },
      { new: true }
    ).select('-password');
    res.json(user.assignments);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id/assignments/:aId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { assignments: { _id: req.params.aId } } },
      { new: true }
    ).select('-password');
    res.json(user.assignments);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Budget Manager ────────────────────────────────────────────

router.put('/:id/budget', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { 'budget.monthly': req.body.monthly } },
      { new: true }
    ).select('-password');
    res.json(user.budget);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.post('/:id/expenses', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { 'budget.expenses': req.body },
        $inc:  { 'budget.spent': req.body.amount },
      },
      { new: true }
    ).select('-password');
    res.json(user.budget);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id/expenses/:eId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const expense = user.budget.expenses.id(req.params.eId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    const amount = expense.amount;
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { 'budget.expenses': { _id: req.params.eId } },
      $inc:  { 'budget.spent': -amount },
    });
    const updated = await User.findById(req.params.id).select('-password');
    res.json(updated.budget);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Wellbeing Hub ─────────────────────────────────────────────

router.post('/:id/mood', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { 'wellbeing.moodLog': req.body },
        $set:  { 'wellbeing.score': req.body.score ?? 0 },
      },
      { new: true }
    ).select('-password');
    res.json(user.wellbeing);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Calendar / Events ─────────────────────────────────────────

router.post('/:id/events', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { events: req.body } },
      { new: true }
    ).select('-password');
    res.json(user.events);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id/events/:evId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { events: { _id: req.params.evId } } },
      { new: true }
    ).select('-password');
    res.json(user.events);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Notifications ─────────────────────────────────────────────

router.put('/:id/notifications/:nId/read', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, 'notifications._id': req.params.nId },
      { $set: { 'notifications.$.read': true } },
      { new: true }
    ).select('-password');
    res.json(user.notifications);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/notifications/read-all', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { 'notifications.$[].read': true } },
      { new: true }
    ).select('-password');
    res.json(user.notifications);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Settings ──────────────────────────────────────────────────

router.put('/:id/settings', async (req, res) => {
  try {
    const update = {};
    Object.keys(req.body).forEach(k => { update[`settings.${k}`] = req.body[k]; });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).select('-password');
    res.json(user.settings);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Stats (Dashboard) ─────────────────────────────────────────

router.put('/:id/stats', async (req, res) => {
  try {
    const update = {};
    Object.keys(req.body).forEach(k => { update[`stats.${k}`] = req.body[k]; });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).select('-password');
    res.json(user.stats);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
