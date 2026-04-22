const User = require("../models/User");

// ✅ Get all counselors
exports.getAllCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: "Counselor" }).select("-password");
    res.json(counselors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get counselor by ID
exports.getCounselorById = async (req, res) => {
  try {
    const { id } = req.params;
    const counselor = await User.findOne({ _id: id, role: "Counselor" }).select("-password");
    if (!counselor) return res.status(404).json({ error: "Counselor not found" });
    res.json(counselor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get available slots for a counselor
// For simplicity, we can generate dynamic slots locally here, or define fixed available logic
exports.getCounselorSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const counselor = await User.findOne({ _id: id, role: "Counselor" });
    if (!counselor) return res.status(404).json({ error: "Counselor not found" });

    // Dummy slots implementation based on today and tomorrow (real backend logic can be customized)
    const Booking = require("../models/Booking");
    const today = new Date();
    const tom = new Date(today);
    tom.setDate(tom.getDate() + 1);
    
    const dates = [today.toISOString().split("T")[0], tom.toISOString().split("T")[0]];
    const times = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"];
    
    // Check existing bookings for these dates
    const existingBookings = await Booking.find({
      counselor: id,
      date: { $in: dates },
      status: { $in: ["Pending", "Confirmed"] }
    });
    
    const slots = [];
    for (const date of dates) {
      for (const time of times) {
        // Find if booked
        const isBooked = existingBookings.some((b) => b.date === date && b.timeSlot === time);
        if (!isBooked) {
          slots.push({ date, time });
        }
      }
    }
    
    res.json({ slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
