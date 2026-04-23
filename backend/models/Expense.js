const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    title: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    month: {
      type: String, // Format: YYYY-MM
      required: true
    },
    note: {
      type: String,
      default: ""
    }
=======
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    month: { type: String, required: true }, // YYYY-MM
    note: { type: String, default: "" }
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  },
  { timestamps: true }
);

<<<<<<< HEAD
module.exports = mongoose.model("Expense", expenseSchema);
=======
module.exports = mongoose.model("Expense", expenseSchema);
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
