const express = require("express");
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  clearAllExpenses
} = require("../controllers/expenseController");

router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.post("/", addExpense);
router.put("/:id", updateExpense);
router.delete("/clear", clearAllExpenses);
router.delete("/:id", deleteExpense);

module.exports = router;