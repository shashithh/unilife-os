const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
    {
        // store hours per weekday (0=Sun ... 6=Sat)
        hoursByDay: {
            type: [Number],
            default: [2, 2, 2, 2, 2, 4, 4],
            validate: v => Array.isArray(v) && v.length === 7
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);