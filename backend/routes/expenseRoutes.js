const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/expenseController");

router.get("/", ctrl.getExpenses);
router.get("/:id", ctrl.getExpenseById);
router.post("/", ctrl.addExpense);
router.put("/:id", ctrl.updateExpense);
router.delete("/clear", ctrl.clearAllExpenses);
router.delete("/:id", ctrl.deleteExpense);

module.exports = router;
