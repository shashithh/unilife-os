const Expense = require("../models/Expense");
const Settings = require("../models/Settings");

const mongoose = require("mongoose");

exports.getInsights = async (req, res) => {
  // 🛠️ Immediate Mock if DB is down
  if (mongoose.connection.readyState !== 1) {
    return res.json({
      totalSpent: 12500,
      topCategory: "Food",
      topAmount: 4500,
      predictedMonthlySpend: 38000,
      monthlyBudget: 50000,
      message: "Showing mock insights (DB Offline)"
    });
  }

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

    const categoryMap = {};
    expenses.forEach((item) => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
    });

    let topCategory = "None";
    let topAmount = 0;

    for (const category in categoryMap) {
      if (categoryMap[category] > topAmount) {
        topAmount = categoryMap[category];
        topCategory = category;
      }
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const avgDailySpend = currentDay > 0 ? totalSpent / currentDay : 0;
    const predictedMonthlySpend = Math.round(avgDailySpend * 30);

    res.json({
      totalSpent,
      topCategory,
      topAmount,
      predictedMonthlySpend,
      monthlyBudget: settings.monthlyBudget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};