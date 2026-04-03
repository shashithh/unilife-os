const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Budget Backend API is running...");
});

const expenseRoutes = require("./routes/expenseRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const alertsRoutes = require("./routes/alertsRoutes");

app.use("/api/budget/expenses", expenseRoutes);
app.use("/api/budget/settings", settingsRoutes);
app.use("/api/budget/dashboard", dashboardRoutes);
app.use("/api/budget/insights", insightsRoutes);
app.use("/api/budget/alerts", alertsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});