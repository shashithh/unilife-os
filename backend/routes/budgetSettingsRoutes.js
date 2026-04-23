const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/budgetSettingsController");

router.get("/", ctrl.getSettings);
router.put("/", ctrl.updateSettings);
router.get("/monthly", ctrl.getMonthlyBudgets);
router.get("/monthly/:month", ctrl.getMonthlyBudget);
router.post("/monthly", ctrl.setMonthlyBudget);
router.delete("/monthly/:month", ctrl.deleteMonthlyBudget);

module.exports = router;
