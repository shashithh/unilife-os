const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/unilifeOsDB")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err))

// Create Schemas
const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  date: String,
  notes: String
})

const budgetSchema = new mongoose.Schema({
  amount: Number,
  month: String, // format: YYYY-MM
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Create Models
const Expense = mongoose.model("Expense", expenseSchema)
const Budget = mongoose.model("Budget", budgetSchema)

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀")
})

// Save expense to MongoDB
app.post("/add-expense", async (req, res) => {
  try {
    const newExpense = new Expense(req.body)
    await newExpense.save()
    res.json({ message: "Expense saved to DB ✅" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save monthly budget to MongoDB helper
const saveBudgetHandler = async (req, res) => {
  try {
    const { amount, month, userId } = req.body
    if (!amount || !month || !userId) {
      return res.status(400).json({ error: "amount, month, and userId are required" })
    }

    // Prevent duplicate budget for the same user/month
    const existing = await Budget.findOne({ userId, month })
    if (existing) {
      return res.status(400).json({ error: "Budget for this month already exists" })
    }

    const newBudget = new Budget({ amount, month, userId })
    await newBudget.save()
    res.json({ message: "Budget saved to DB ✅", budget: newBudget })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

app.post("/add-budget", saveBudgetHandler)
app.post("/api/add-budget", saveBudgetHandler)

// Get budgets from MongoDB - optional user filtering by query param
const getBudgetsHandler = async (req, res) => {
  try {
    const { userId } = req.query
    const query = userId ? { userId } : {}
    const data = await Budget.find(query).sort({ createdAt: -1 })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

app.get("/budgets", getBudgetsHandler)
app.get("/api/budgets", getBudgetsHandler)

// Get expenses from MongoDB
const getExpensesHandler = async (req, res) => {
  try {
    const { month } = req.query
    let query = {}
    if (month) {
      // Filter by month (YYYY-MM format) - create date range
      const [year, monthNum] = month.split('-')
      const startDate = `${year}-${monthNum}-01`
      const endMonth = String(parseInt(monthNum) + 1).padStart(2, '0')
      const endYear = parseInt(monthNum) === 12 ? parseInt(year) + 1 : year
      const endDate = `${endYear}-${endMonth}-01`
      query = { 
        date: { 
          $gte: startDate,
          $lt: endDate
        } 
      }
    }
    const data = await Expense.find(query).sort({ date: -1 })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
app.get("/expenses", getExpensesHandler)
app.get("/api/expenses", getExpensesHandler)

// Update expense in MongoDB
const updateExpenseHandler = async (req, res) => {
  try {
    await Expense.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: "Updated ✅" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
app.put("/update-expense/:id", updateExpenseHandler)
app.put("/api/update-expense/:id", updateExpenseHandler)

// Delete expense from MongoDB
const deleteExpenseHandler = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted successfully ✅" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
app.delete("/delete-expense/:id", deleteExpenseHandler)
app.delete("/api/delete-expense/:id", deleteExpenseHandler)

// Delete budget from MongoDB
const deleteBudgetHandler = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id)
    res.json({ message: "Budget deleted successfully ✅" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
app.delete("/delete-budget/:id", deleteBudgetHandler)
app.delete("/api/delete-budget/:id", deleteBudgetHandler)

// Start server

// Start server
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})