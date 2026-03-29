const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            required: true
        },
        time: {
            type: String,
            required: true
        },
        task: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["class", "study", "collab", "admin"],
            default: "study"
        },
        color: {
            type: String,
            default: "bg-blue-100 text-blue-700 border-blue-200"
        },
        ai: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("StudySession", studySessionSchema);