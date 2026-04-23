const mongoose = require("mongoose");

const monthlyBudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    month: { type: String, required: true }, // YYYY-MM
    monthlyBudget: { type: Number, required: true }
  },
  { timestamps: true }
);

// One budget per user per month
monthlyBudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlyBudget", monthlyBudgetSchema);
