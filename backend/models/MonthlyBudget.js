const mongoose = require("mongoose");

const monthlyBudgetSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    month: {
      type: String,
      required: true,
      unique: true, // ensuring one budget per month (format: YYYY-MM)
    },
    monthlyBudget: {
      type: Number,
      required: true,
    }
=======
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    month: { type: String, required: true }, // YYYY-MM
    monthlyBudget: { type: Number, required: true }
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  },
  { timestamps: true }
);

<<<<<<< HEAD
=======
// One budget per user per month
monthlyBudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
module.exports = mongoose.model("MonthlyBudget", monthlyBudgetSchema);
