const mongoose = require("mongoose");

const monthlyBudgetSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      unique: true, // ensuring one budget per month (format: YYYY-MM)
    },
    monthlyBudget: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MonthlyBudget", monthlyBudgetSchema);
