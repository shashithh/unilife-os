const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const moodRoutes = require("./routes/moodRoutes");/*
const supportRoutes = require("./routes/supportRoutes");
const counselorRoutes = require("./routes/counselorRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const aiRoutes = require("./routes/aiRoutes");
*/
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("✅ Wellbeing Hub API Running"));
app.use("/api/moods", moodRoutes);
/*
app.use("/api/support", supportRoutes);
app.use("/api/counselors", counselorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
*/
// DB Connect
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));