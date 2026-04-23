const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======
const ctrl = require("../controllers/expenseController");

router.get("/", ctrl.getExpenses);
router.get("/:id", ctrl.getExpenseById);
router.post("/", ctrl.addExpense);
router.put("/:id", ctrl.updateExpense);
router.delete("/clear", ctrl.clearAllExpenses);
router.delete("/:id", ctrl.deleteExpense);

module.exports = router;
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
