const express = require("express");
const router = express.Router();
const {
  getIncomes,
  getIncomeById,
  addIncome,
  updateIncome,
  deleteIncome,
  clearAllIncomes
} = require("../controllers/incomeController");

router.get("/", getIncomes);
router.get("/:id", getIncomeById);
router.post("/", addIncome);
router.put("/:id", updateIncome);
router.delete("/clear", clearAllIncomes);
router.delete("/:id", deleteIncome);

module.exports = router;
