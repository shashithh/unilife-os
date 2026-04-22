const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, bookingController.createBooking);
router.get("/my", protect, bookingController.getMyBookings);
router.get("/counselor", protect, bookingController.getCounselorBookings);
router.patch("/:id/status", protect, bookingController.updateBookingStatus);

// Keeping old routes to not break everything immediately if something expects them
router.post("/old-book", bookingController.bookSession);
router.get("/old/:studentId", bookingController.getStudentBookings);

module.exports = router;