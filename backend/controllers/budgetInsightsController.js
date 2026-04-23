const Expense = require("../models/Expense");
const BudgetSettings = require("../models/BudgetSettings");

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId });
    let settings = await BudgetSettings.findOne({ userId });
    if (!settings) {
      settings = await BudgetSettings.create({ userId, monthlyBudget: 50000, warningThreshold: 80 });
    }

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryMap = {};
    expenses.forEach(e => { categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount; });

    let topCategory = "None", topAmount = 0;
    for (const cat in categoryMap) {
      if (categoryMap[cat] > topAmount) { topAmount = categoryMap[cat]; topCategory = cat; }
    }

    const day = new Date().getDate();
    const avgDaily = day > 0 ? totalSpent / day : 0;
    const predictedMonthlySpend = Math.round(avgDaily * 30);

    res.json({ totalSpent, topCategory, topAmount, predictedMonthlySpend, monthlyBudget: settings.monthlyBudget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
