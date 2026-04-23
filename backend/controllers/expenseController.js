const Expense = require("../models/Expense");

<<<<<<< HEAD
const mongoose = require("mongoose");

exports.getExpenses = async (req, res) => {
  // 🛠️ Immediate Mock if DB is down
  if (mongoose.connection.readyState !== 1) {
    return res.json([
      { _id: 'e1', title: 'Lunch', amount: 850, category: 'Food', date: new Date(), note: 'Rice and curry' },
      { _id: 'e2', title: 'Bus', amount: 120, category: 'Transport', date: new Date(), note: '' }
    ]);
  }

  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
=======
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  }
};

exports.getExpenseById = async (req, res) => {
  try {
<<<<<<< HEAD
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
=======
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, month, note } = req.body;
<<<<<<< HEAD

    const newExpense = new Expense({
      title,
      amount,
      category,
      date,
      month,
      note
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
=======
    const expense = await Expense.create({
      userId: req.user.id,
      title, amount, category, date, month, note
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  }
};

exports.updateExpense = async (req, res) => {
  try {
<<<<<<< HEAD
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
=======
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  }
};

exports.deleteExpense = async (req, res) => {
  try {
<<<<<<< HEAD
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
=======
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
  }
};

exports.clearAllExpenses = async (req, res) => {
  try {
<<<<<<< HEAD
    await Expense.deleteMany({});
    res.json({ message: "All expenses have been permanently deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
=======
    await Expense.deleteMany({ userId: req.user.id });
    res.json({ message: "All your expenses have been deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
>>>>>>> 14f4b5c (setup wellbeing hub backend structure with models routes and controllers)
