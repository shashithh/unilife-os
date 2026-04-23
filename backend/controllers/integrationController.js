const Task = require("../models/Task");
const MoodEntry = require("../models/MoodEntry");
const StressEntry = require("../models/StressEntry");
const Booking = require("../models/Booking");
const { getRiskLevel } = require("../services/plannerService");

const getStudentOverview = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Fetch Task data
        const tasks = await Task.find({ userId });
        const pendingTasks = tasks.filter((t) => t.status !== "Completed");
        const criticalTasks = pendingTasks.filter((t) => t.risk === "Critical");
        
        // 2. Fetch Wellbeing data (today's entries or latest)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const latestMood = await MoodEntry.findOne({ student: userId }).sort({ createdAt: -1 });
        const latestStress = await StressEntry.findOne({ student: userId }).sort({ createdAt: -1 });
        
        // 3. Calculate Burnout Risk
        let burnoutRisk = "Low";
        let recommendation = "Keep up the good work!";
        
        let riskScore = 0;
        
        if (criticalTasks.length > 2) riskScore += 2;
        if (criticalTasks.length > 0 && criticalTasks.length <= 2) riskScore += 1;
        
        if (latestStress && latestStress.stressLevel > 6) riskScore += 2;
        if (latestStress && latestStress.stressLevel > 4) riskScore += 1;
        
        if (latestMood && (latestMood.mood === "stressed" || latestMood.mood === "sad" || latestMood.mood === "overwhelmed")) riskScore += 1;
        
        if (riskScore >= 4) {
             burnoutRisk = "High";
             recommendation = "You have high stress and critical tasks. Please consider reducing your task load or booking a session with a counselor.";
        } else if (riskScore === 3 || riskScore === 2) {
             burnoutRisk = "Moderate";
             recommendation = "You have a balanced workload but elevated stress. Take breaks and prioritize tasks carefully.";
        }
        
        // 4. Fetch next upcoming booking (soonest Pending/Confirmed session)
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Use find().sort().limit(1) — findOne().sort() is unreliable in Mongoose
        const upcomingBookings = await Booking.find({
            student: userId,
            status: { $in: ["Pending", "Confirmed"] }
        })
<<<<<<< HEAD
        .populate("counselor", "fullName")
=======
        .populate("counselor", "fullName displayName showFullName")
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
        .sort({ date: 1, timeSlot: 1 })
        .lean();

        // Filter client-side to be safe with string date comparison
        const futureBookings = upcomingBookings.filter(b => b.date >= todayStr);
        const nextBooking = futureBookings[0] || null;

        let nextSessionCounselor = null;
        let nextSessionDate = null;

        if (nextBooking) {
<<<<<<< HEAD
            nextSessionCounselor = nextBooking.counselor ? nextBooking.counselor.fullName : null;
=======
            const c = nextBooking.counselor;
            if (c) {
                // Respect privacy settings
                if (c.showFullName === "No" && c.displayName) {
                    nextSessionCounselor = c.displayName;
                } else {
                    nextSessionCounselor = c.fullName;
                }
            }
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
            const bookingDate = new Date(nextBooking.date + "T00:00:00");
            const diffMs = bookingDate - now;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) nextSessionDate = "Today";
            else if (diffDays === 1) nextSessionDate = "Tomorrow";
            else nextSessionDate = bookingDate.toLocaleDateString([], { month: "short", day: "numeric" });
        }

        res.json({
            pendingTasks: pendingTasks.length,
            criticalTasks: criticalTasks.length,
            latestMood: latestMood ? latestMood.mood : "Not logged",
            latestStressLevel: latestStress ? latestStress.stressLevel : "Not logged",
            burnoutRisk,
            recommendation,
            nextSessionCounselor,
            nextSessionDate
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
   getStudentOverview
};
