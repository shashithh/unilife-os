const router = require("express").Router();
const c = require("../controllers/calendarController");

router.get("/", c.getCalendar);

module.exports = router;