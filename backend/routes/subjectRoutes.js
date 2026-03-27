const router = require("express").Router();
const c = require("../controllers/subjectController");

router.post("/", c.createSubject);
router.get("/", c.getSubjects);

module.exports = router;