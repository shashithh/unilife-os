const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, trim: true },
        color: { type: String, default: "#3B82F6" } // for calendar UI
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);