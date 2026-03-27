const Subject = require("../models/Subject");

exports.createSubject = async (req, res, next) => {
    try {
        const { name, code, color } = req.body;
        const subject = await Subject.create({ name, code, color });
        res.status(201).json(subject);
    } catch (e) { next(e); }
};

exports.getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        res.json(subjects);
    } catch (e) { next(e); }
};