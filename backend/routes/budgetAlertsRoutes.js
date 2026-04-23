const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/budgetAlertsController");

router.get("/", ctrl.getAlerts);

module.exports = router;
