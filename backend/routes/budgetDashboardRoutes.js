const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/budgetDashboardController");

router.get("/", ctrl.getDashboard);

module.exports = router;
