const Income = require("../models/Income");

const mongoose = require("mongoose");

exports.getIncomes = async (req, res) => {
  // 🛠️ Immediate Mock if DB is down
  if (mongoose.connection.readyState !== 1) {
    return res.json([
      { _id: 'i1', title: 'Pocket Money', amount: 5000, category: 'Allowance', date: new Date(), note: '' },
      { _id: 'i2', title: 'Part-time job', amount: 15000, category: 'Salary', date: new Date(), note: '' }
    ]);
  }

  try {
    const incomes = await Income.find().sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const { title, amount, category, date, month, note } = req.body;

    const newIncome = new Income({
      title,
      amount,
      category,
      date,
      month,
      note
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json(updatedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearAllIncomes = async (req, res) => {
  try {
    await Income.deleteMany({});
    res.json({ message: "All incomes have been permanently deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
