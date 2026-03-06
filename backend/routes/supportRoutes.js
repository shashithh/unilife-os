const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");

router.post("/", supportController.createRequest);
router.get("/", supportController.getAllRequests);

module.exports = router;