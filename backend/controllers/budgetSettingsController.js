const BudgetSettings = require("../models/BudgetSettings");
const MonthlyBudget = require("../models/MonthlyBudget");

exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await BudgetSettings.findOne({ userId });
    if (!settings) {
      settings = await BudgetSettings.create({
        userId, monthlyBudget: 50000, warningThreshold: 80,
        strictMode: false, categoryBudgets: {}, muteAllAlerts: false, enableEmailAlerts: false
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await BudgetSettings.findOne({ userId });
    if (!settings) {
      settings = new BudgetSettings({ userId, ...req.body });
    } else {
      settings.monthlyBudget = req.body.monthlyBudget ?? settings.monthlyBudget;
      settings.warningThreshold = req.body.warningThreshold ?? settings.warningThreshold;
      if (req.body.strictMode !== undefined) settings.strictMode = req.body.strictMode;
      if (req.body.categoryBudgets !== undefined) settings.categoryBudgets = req.body.categoryBudgets;
      if (req.body.muteAllAlerts !== undefined) settings.muteAllAlerts = req.body.muteAllAlerts;
      if (req.body.enableEmailAlerts !== undefined) settings.enableEmailAlerts = req.body.enableEmailAlerts;
    }
    const saved = await settings.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMonthlyBudget = async (req, res) => {
  try {
    const doc = await MonthlyBudget.findOne({ userId: req.user.id, month: req.params.month });
    if (!doc) return res.status(404).json({ message: "Monthly budget not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setMonthlyBudget = async (req, res) => {
  try {
    const { month, monthlyBudget } = req.body;
    if (!month || !monthlyBudget) return res.status(400).json({ message: "month and monthlyBudget required" });
    const doc = await MonthlyBudget.findOneAndUpdate(
      { userId: req.user.id, month },
      { userId: req.user.id, month, monthlyBudget },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMonthlyBudget = async (req, res) => {
  try {
    const doc = await MonthlyBudget.findOneAndDelete({ userId: req.user.id, month: req.params.month });
    if (!doc) return res.status(404).json({ message: "Monthly budget not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMonthlyBudgets = async (req, res) => {
  try {
    const docs = await MonthlyBudget.find({ userId: req.user.id }).sort({ month: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
