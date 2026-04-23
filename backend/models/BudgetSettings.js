const mongoose = require("mongoose");

const budgetSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    monthlyBudget: { type: Number, default: 50000 },
    warningThreshold: { type: Number, default: 80 },
    strictMode: { type: Boolean, default: false },
    categoryBudgets: { type: Map, of: Number, default: {} },
    muteAllAlerts: { type: Boolean, default: false },
    enableEmailAlerts: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BudgetSettings", budgetSettingsSchema);
