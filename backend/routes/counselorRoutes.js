const express = require("express");
const router = express.Router();
const counselorController = require("../controllers/counselorController");

router.post("/", counselorController.addCounselor);
router.get("/", counselorController.getCounselors);

module.exports = router;