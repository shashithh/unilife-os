const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const plannerRoutes  = require("./routes/plannerRoutes");
const aiRoutes       = require("./routes/aiRoutes");
const authRoutes     = require("./routes/authRoutes");
const projectRoutes  = require("./routes/projectRoutes");
const userRoutes     = require("./routes/userRoutes");
const errorHandler   = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/planner",  plannerRoutes);
app.use("/api/ai",       aiRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users",    userRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Home test route
app.get("/", (req, res) => {
    res.send("UniLife OS Backend Running...");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
