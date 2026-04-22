const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const { protect } = require("./middleware/authMiddleware");

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/subjects", protect, require("./routes/subjectRoutes"));
app.use("/api/tasks", protect, require("./routes/taskRoutes"));
app.use("/api/planner", protect, require("./routes/plannerRoutes"));
app.use("/api/calendar", protect, require("./routes/calendarRoutes"));
app.use("/api/alerts", protect, require("./routes/alertRoutes"));

app.use("/api/counselors", require("./routes/counselorRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/moods", require("./routes/moodRoutes"));
app.use("/api/stress", require("./routes/stressRoutes"));

// Ruwandhi
app.use("/api/budget/expenses", require("./routes/expenseRoutes"));
app.use("/api/budget/incomes", require("./routes/incomeRoutes"));
app.use("/api/budget/settings", require("./routes/settingsRoutes"));
app.use("/api/budget/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/budget/insights", require("./routes/insightsRoutes"));
app.use("/api/budget/alerts", require("./routes/alertsRoutes"));

app.use("/api/integration", protect, require("./routes/integrationRoutes"));

app.get("/", (req, res) => {
    res.json({ message: "Smart Academic Planner API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});