const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },

        deadline: { type: Date, required: true },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true
        },

        estimatedHours: { type: Number, default: 1 },

        // ✅ Calendar support
        scheduledDate: { type: Date, required: true }, // show on calendar (day)
        startTime: { type: String, default: "18:00" }, // optional for UI
        endTime: { type: String, default: "19:00" },   // optional for UI

        status: {
            type: String,
            enum: ["Pending", "Completed", "Missed"],
            default: "Pending"
        },

        completionRate: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);