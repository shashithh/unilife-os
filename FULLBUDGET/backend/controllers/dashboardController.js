const Expense = require("../models/Expense");
const Settings = require("../models/Settings");
const MonthlyBudget = require("../models/MonthlyBudget");

exports.getDashboard = async (req, res) => {
  try {
    const expenses = await Expense.find();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        monthlyBudget: 50000,
        warningThreshold: 80
      });
    }

    // Attempt to override with specific month budget if configured
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyBudgetDoc = await MonthlyBudget.findOne({ month: currentMonth });
    const appliedBudget = monthlyBudgetDoc ? monthlyBudgetDoc.monthlyBudget : settings.monthlyBudget;

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const remainingBudget = appliedBudget - totalSpent;
    const totalExpenses = expenses.length;

    res.json({
      totalSpent,
      remainingBudget,
      totalExpenses,
      monthlyBudget: appliedBudget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};