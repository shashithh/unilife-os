const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.get("/risk/:studentId", aiController.getRiskAndRecommendations);

module.exports = router;