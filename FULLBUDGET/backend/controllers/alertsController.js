const Expense = require("../models/Expense");
const Settings = require("../models/Settings");

exports.getAlerts = async (req, res) => {
  try {
    const expenses = await Expense.find();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        monthlyBudget: 50000,
        warningThreshold: 80
      });
    }

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const percentageUsed = (totalSpent / settings.monthlyBudget) * 100;

    const alerts = [];

    if (percentageUsed >= 100) {
      alerts.push({
        type: "danger",
        message: "Budget exceeded"
      });
    } else if (percentageUsed >= settings.warningThreshold) {
      alerts.push({
        type: "warning",
        message: `Warning: You have used ${Math.round(percentageUsed)}% of your budget`
      });
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const avgDailySpend = currentDay > 0 ? totalSpent / currentDay : 0;
    const predictedMonthlySpend = Math.round(avgDailySpend * 30);

    if (predictedMonthlySpend > settings.monthlyBudget) {
      alerts.push({
        type: "prediction",
        message: "At this rate, you may exceed your budget this month"
      });
    }

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};