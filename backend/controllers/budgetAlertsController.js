const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const BudgetSettings = require("../models/BudgetSettings");
const MonthlyBudget = require("../models/MonthlyBudget");

exports.getAlerts = async (req, res) => {
  try {
    // Cast to ObjectId so the Mongoose query matches correctly regardless of
    // whether the JWT decoder returns a plain string or an ObjectId string.
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // ── Get current month (YYYY-MM) in LOCAL time ─────────────────
    // Using toISOString() gives UTC, which can be one month behind for UTC+
    // timezones (e.g., UTC+5:30 after midnight). Use local date parts instead.
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // ── Fetch only this month's expenses ───────────────────────
    const expenses = await Expense.find({ userId, month: currentMonth });

    // ── Budget settings ─────────────────────────────────────────
    let settings = await BudgetSettings.findOne({ userId });
    if (!settings) {
      settings = await BudgetSettings.create({
        userId,
        monthlyBudget: 50000,
        warningThreshold: 80,
      });
    }

    // If user muted all alerts, return empty array
    if (settings.muteAllAlerts) {
      return res.json([]);
    }

    // ── Resolve budget for this month ────────────────────────────
    const monthlyBudgetDoc = await MonthlyBudget.findOne({ userId, month: currentMonth });
    const monthlyBudget = monthlyBudgetDoc
      ? monthlyBudgetDoc.monthlyBudget
      : settings.monthlyBudget;

    // ── Overall spending calculations ────────────────────────────
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const pct = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
    const remaining = monthlyBudget - totalSpent;

    const alerts = [];

    // ── 1. Budget Exceeded ────────────────────────────────────────
    if (pct >= 100) {
      alerts.push({
        type: "danger",
        category: "overall",
        message: `You have exceeded your monthly budget! You spent Rs ${totalSpent.toLocaleString()}, which is Rs ${Math.abs(remaining).toLocaleString()} over your Rs ${monthlyBudget.toLocaleString()} budget.`,
      });
    }
    // ── 2. Budget Warning ─────────────────────────────────────────
    else if (pct >= settings.warningThreshold) {
      alerts.push({
        type: "warning",
        category: "overall",
        message: `You have used ${Math.round(pct)}% of your monthly budget. Rs ${totalSpent.toLocaleString()} spent out of Rs ${monthlyBudget.toLocaleString()}. Only Rs ${remaining.toLocaleString()} remaining.`,
      });
    }

    // ── 3. Spending Rate Prediction ───────────────────────────────
    const day = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    if (day > 0) {
      const dailyAvg = totalSpent / day;
      const projected = Math.round(dailyAvg * daysInMonth);
      if (projected > monthlyBudget) {
        const overshoot = projected - monthlyBudget;
        alerts.push({
          type: "prediction",
          category: "overall",
          message: `At your current spending rate (Rs ${Math.round(dailyAvg).toLocaleString()}/day), you are projected to spend Rs ${projected.toLocaleString()} this month — Rs ${overshoot.toLocaleString()} over your budget.`,
        });
      }
    }

    // ── 4. Category-level budget alerts ───────────────────────────
    if (settings.categoryBudgets && settings.categoryBudgets.size > 0) {
      // Sum spending per category for current month
      const spendByCategory = {};
      for (const exp of expenses) {
        spendByCategory[exp.category] = (spendByCategory[exp.category] || 0) + exp.amount;
      }

      for (const [cat, catBudget] of settings.categoryBudgets.entries()) {
        const catSpent = spendByCategory[cat] || 0;
        const catPct = catBudget > 0 ? (catSpent / catBudget) * 100 : 0;

        if (catPct >= 100) {
          alerts.push({
            type: "danger",
            category: cat,
            message: `Category "${cat}" exceeded: Spent Rs ${catSpent.toLocaleString()} against a Rs ${catBudget.toLocaleString()} limit.`,
          });
        } else if (catPct >= settings.warningThreshold) {
          alerts.push({
            type: "warning",
            category: cat,
            message: `Category "${cat}" is at ${Math.round(catPct)}% — Rs ${catSpent.toLocaleString()} of Rs ${catBudget.toLocaleString()} used.`,
          });
        }
      }
    }

    res.json(alerts);
  } catch (err) {
    console.error("Budget alerts error:", err);
    res.status(500).json({ message: err.message });
  }
};
