const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            required: true
        },
        estimatedHours: {
            type: Number,
            required: true,
            min: 0.5
        },
        description: {
            type: String,
            default: ""
        },
        risk: {
            type: String,
            enum: ["Safe", "Warning", "Critical"],
            default: "Safe"
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "Overdue"],
            default: "Pending"
        },
        completionRate: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);