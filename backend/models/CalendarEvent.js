const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["class", "study", "assignment", "exam"],
            required: true
        },
        color: {
            type: String,
            default: "bg-blue-100 text-blue-700 border-blue-200"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);