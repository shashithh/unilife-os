const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        subjectName: {
            type: String,
            required: true,
            trim: true
        },
        subjectCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            match: /^[A-Za-z]{2}\d{4}$/
        },
        colorTheme: {
            type: String,
            default: "bg-blue-500"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);