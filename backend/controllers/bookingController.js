const Booking = require("../models/Booking");

// ✅ Create booking (Student)
exports.createBooking = async (req, res) => {
  try {
    const { counselorId, date, timeSlot, sessionMode, reason, urgency, notes } = req.body;
    const studentId = req.user.id;

    // Optional: check if slot is already booked
    const exists = await Booking.findOne({ counselor: counselorId, date, timeSlot, status: { $in: ["Pending", "Confirmed"] } });
    if (exists) return res.status(400).json({ error: "Slot already booked" });

    const booking = await Booking.create({
      student: studentId,
      counselor: counselorId,
      date,
      timeSlot,
      sessionMode,
      reason,
      urgency,
      notes
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get my bookings (Student)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user.id })
      .populate("counselor", "fullName specialization profileImage")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get counselor bookings (Counselor)
exports.getCounselorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ counselor: req.user.id })
      .populate("student", "fullName email studentId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update booking status (Counselor/Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Verify counselor owns this booking if they are a counselor
    if (req.user.role === "Counselor" && booking.counselor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dummy backward compatibility for the older route
exports.bookSession = exports.createBooking;
exports.getStudentBookings = exports.getMyBookings;
