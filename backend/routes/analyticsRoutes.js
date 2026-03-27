const router = require("express").Router();
const c = require("../controllers/analyticsController");

router.get("/productivity", c.productivity);
router.put("/refresh-risk", c.refreshRisk);

module.exports = router;