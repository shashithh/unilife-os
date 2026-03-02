const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    estimatedHours: {
        type: Number,
        required: false
    }
    ,
    status: {
        type: String,
        enum: ["Pending", "Completed", "Missed"],
        default: "Pending"
    },
    completionRate: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
