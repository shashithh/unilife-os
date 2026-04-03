const Settings = require("../models/Settings");
const MonthlyBudget = require("../models/MonthlyBudget");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        monthlyBudget: 50000,
        warningThreshold: 80,
        strictMode: false,
        categoryBudgets: {},
        muteAllAlerts: false,
        enableEmailAlerts: false
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings.monthlyBudget = req.body.monthlyBudget ?? settings.monthlyBudget;
      settings.warningThreshold = req.body.warningThreshold ?? settings.warningThreshold;
      if (req.body.strictMode !== undefined) {
        settings.strictMode = req.body.strictMode;
      }
      if (req.body.categoryBudgets !== undefined) {
        settings.categoryBudgets = req.body.categoryBudgets;
      }
      if (req.body.muteAllAlerts !== undefined) {
        settings.muteAllAlerts = req.body.muteAllAlerts;
      }
      if (req.body.enableEmailAlerts !== undefined) {
        settings.enableEmailAlerts = req.body.enableEmailAlerts;
      }
    }

    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMonthlyBudget = async (req, res) => {
  try {
    const { month } = req.params;
    const monthlyBudget = await MonthlyBudget.findOne({ month });
    if (!monthlyBudget) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }
    res.json(monthlyBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setMonthlyBudget = async (req, res) => {
  try {
    const { month, monthlyBudget } = req.body;
    if (!month || !monthlyBudget) {
      return res.status(400).json({ message: "Month and monthlyBudget are required" });
    }
    const updated = await MonthlyBudget.findOneAndUpdate(
      { month },
      { month, monthlyBudget },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMonthlyBudget = async (req, res) => {
  try {
    const { month } = req.params;
    const deleted = await MonthlyBudget.findOneAndDelete({ month });
    if (!deleted) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }
    res.json({ message: "Monthly budget deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyBudgets = async (req, res) => {
  try {
    const monthlyBudgets = await MonthlyBudget.find().sort({ month: 1 });
    res.json(monthlyBudgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};