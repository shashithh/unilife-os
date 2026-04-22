const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getMonthlyBudget,
  setMonthlyBudget,
  deleteMonthlyBudget,
  getMonthlyBudgets
} = require("../controllers/settingsController");

router.get("/", getSettings);
router.put("/", updateSettings);
router.get("/monthly", getMonthlyBudgets);
router.get("/monthly/:month", getMonthlyBudget);
router.post("/monthly", setMonthlyBudget);
router.delete("/monthly/:month", deleteMonthlyBudget);

module.exports = router;