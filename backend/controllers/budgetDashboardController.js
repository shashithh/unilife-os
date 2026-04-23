const Expense = require("../models/Expense");
const BudgetSettings = require("../models/BudgetSettings");
const MonthlyBudget = require("../models/MonthlyBudget");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId });

    let settings = await BudgetSettings.findOne({ userId });
    if (!settings) {
      settings = await BudgetSettings.create({ userId, monthlyBudget: 50000, warningThreshold: 80 });
    }

    const _now = new Date();
    const currentMonth = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyBudgetDoc = await MonthlyBudget.findOne({ userId, month: currentMonth });
    const appliedBudget = monthlyBudgetDoc ? monthlyBudgetDoc.monthlyBudget : settings.monthlyBudget;

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBudget = appliedBudget - totalSpent;

    res.json({
      totalSpent,
      remainingBudget,
      totalExpenses: expenses.length,
      monthlyBudget: appliedBudget
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
