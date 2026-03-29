const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/planner", require("./routes/plannerRoutes"));
app.use("/api/calendar", require("./routes/calendarRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));

app.get("/", (req, res) => {
    res.json({ message: "Smart Academic Planner API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});