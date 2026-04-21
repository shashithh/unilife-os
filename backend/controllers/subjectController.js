const Subject = require("../models/Subject");

const addSubject = async (req, res) => {
    try {
        const { subjectName, subjectCode, colorTheme } = req.body;

        if (!subjectName || !subjectCode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingSubject = await Subject.findOne({ subjectCode, userId: req.user.id });
        if (existingSubject) {
            return res.status(400).json({ message: "Subject code already exists" });
        }

        const subject = await Subject.create({
            userId: req.user.id,
            subjectName,
            subjectCode,
            colorTheme
        });

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addSubject,
    getSubjects
};