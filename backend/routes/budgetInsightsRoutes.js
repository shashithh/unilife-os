const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/budgetInsightsController");

router.get("/", ctrl.getInsights);

module.exports = router;
