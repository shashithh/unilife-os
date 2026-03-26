import { useState, useEffect } from "react"
import "../styles/Budget.css"

function Budget() {
  const API_URL = "http://localhost:5000"
  const [budget, setBudget] = useState("")
  const [budgetMonth, setBudgetMonth] = useState("")
  const [expenses, setExpenses] = useState([])
  const [savedBudget, setSavedBudget] = useState(0)
  const [budgetError, setBudgetError] = useState("")
  const [budgetMonthError, setBudgetMonthError] = useState("")
  const [budgetSuccess, setBudgetSuccess] = useState("")
  const [budgetEntries, setBudgetEntries] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    notes: ""
  })

  const [formErrors, setFormErrors] = useState({
    amount: "",
    category: "",
    date: "",
    notes: ""
  })

  const [noBudgetError, setNoBudgetError] = useState("")

  // Validation functions
  const validateBudgetAmount = (value) => {
    const num = Number(value)
    if (!value.trim()) return "Budget amount is required"
    if (isNaN(num) || num <= 0) return "Please enter a valid positive number"
    if (num > 1000000) return "Budget amount cannot exceed Rs. 1,000,000"
    return ""
  }

  const validateBudgetMonth = (value) => {
    if (!value) return "Month is required"
    // format YYYY-MM from input type=month
    if (!/^\d{4}-\d{2}$/.test(value)) return "Invalid month format"
    return ""
  }

  const validateExpenseAmount = (value) => {
    const num = Number(value)
    if (!value.trim()) return "Amount is required"
    if (isNaN(num) || num <= 0) return "Please enter a valid positive number"
    if (num > 100000) return "Amount cannot exceed Rs. 100,000"
    return ""
  }

  const validateCategory = (value) => {
    if (!value.trim()) return "Please select a category"
    return ""
  }

  const validateDate = (value) => {
    if (!value) return "Date is required"
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    if (selectedDate > today) return "Date cannot be in the future"
    return ""
  }

  const validateNotes = (value) => {
    if (value.length > 200) return "Notes cannot exceed 200 characters"
    return ""
  }

  // Handle budget input with validation
  const handleBudgetChange = (e) => {
    const value = e.target.value
    // Only allow positive numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setBudget(value)
      setBudgetError(validateBudgetAmount(value))
    }
  }

  // Handle form input changes with validation
  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value })

    let error = ""
    switch (field) {
      case "amount":
        // Only allow positive numbers and decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          error = validateExpenseAmount(value)
        } else {
          error = "Only numbers allowed"
        }
        break
      case "category":
        error = validateCategory(value)
        break
      case "date":
        error = validateDate(value)
        break
      case "notes":
        error = validateNotes(value)
        break
      default:
        break
    }

    setFormErrors({ ...formErrors, [field]: error })
  }

  const loadExpenses = async (month = selectedMonth) => {
    const res = await fetch(`${API_URL}/expenses`)
    const data = await res.json()

    // Client-side month filtering as fallback if backend query fails
    const monthToFilter = month || selectedMonth
    const filtered = data.filter((exp) => {
      if (!exp.date) return false
      // Expecting YYYY-MM-DD
      return exp.date.startsWith(monthToFilter)
    })

    setExpenses(filtered)
  }

  const loadBudgets = async () => {
    const res = await fetch(`${API_URL}/budgets?userId=hardcoded-user-123`)
    const data = await res.json()
    setBudgetEntries(data)
    if (data.length > 0) {
      // show latest Budget for the Month for UX
      setSavedBudget(data[0].amount)
      setBudgetMonth(data[0].month)
    }
  }

  useEffect(() => {
    loadExpenses()
    loadBudgets()
  }, [])

  //  const handleAddExpense = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/add-expense", {
  //       method: "POST", // ✅ MUST ADD THIS
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(form)
  //     })

  //     const data = await response.json()
  //     console.log(data)

  //   } catch (error) {
  //     console.log("Error:", error)
  //   }
  // }

  const handleAddExpense = async () => {
    // Check if budget exists for selected month
    if (selectedBudgetAmount === 0) {
      setNoBudgetError("Please create a budget for this month first!")
      return
    }

    setNoBudgetError("") // Clear error if budget exists

    // Validate all form fields
    const errors = {
      amount: validateExpenseAmount(form.amount),
      category: validateCategory(form.category),
      date: validateDate(form.date),
      notes: validateNotes(form.notes)
    }

    setFormErrors(errors)

    // Check if any errors exist
    const hasErrors = Object.values(errors).some(error => error !== "")

    if (hasErrors) {
      return // Don't proceed if there are validation errors
    }

    try {
      if (editId) {
        // UPDATE
        await fetch(`${API_URL}/update-expense/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        })
      } else {
        // ADD
        await fetch(`${API_URL}/add-expense`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        })
      }

      setEditId(null)
      setForm({ amount: "", category: "", date: "", notes: "" })
      setFormErrors({ amount: "", category: "", date: "", notes: "" })
      await loadExpenses()
    } catch (error) {
      console.error("Error saving expense:", error)
    }
  }

  const [editIndex, setEditIndex] = useState(null)

  const categories = ["Food", "Transport", "Bills", "Education", "Other"]

  const handleSaveBudget = async () => {
    const amountError = validateBudgetAmount(budget)
    const monthError = validateBudgetMonth(budgetMonth)

    const monthExists = budgetEntries.some((entry) => entry.month === budgetMonth)
    const monthDuplicateError = monthExists ? "Budget for this month already exists!" : ""

    setBudgetError(amountError)
    setBudgetMonthError(monthError || monthDuplicateError)
    setBudgetSuccess("")

    if (amountError || monthError || monthDuplicateError) {
      return
    }

    try {
      const payload = {
        amount: Number(budget),
        month: budgetMonth,
        userId: "hardcoded-user-123"
      }

      const response = await fetch(`${API_URL}/add-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        let errMessage = "Failed to save budget"
        const contentType = response.headers.get("content-type") || ""

        if (contentType.includes("application/json")) {
          const errData = await response.json()
          errMessage = errData.error || errMessage
        } else {
          const text = await response.text()
          errMessage = text ? `${errMessage}: ${text}` : errMessage
        }

        throw new Error(errMessage)
      }

      setSavedBudget(payload.amount)
      setBudgetSuccess("Budget saved to DB successfully! ✅")
      setBudget("")
      setBudgetMonth("")
      setBudgetError("")
      setBudgetMonthError("")

      await loadBudgets()
      setTimeout(() => setBudgetSuccess(""), 3000)
    } catch (error) {
      console.error("Error saving budget:", error)
      setBudgetSuccess("Failed to save budget")
    }
  }

  const selectedBudgetEntry = budgetEntries.find((entry) => entry.month === selectedMonth)
  const selectedBudgetAmount = selectedBudgetEntry ? Number(selectedBudgetEntry.amount) : 0

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
  const balance = selectedBudgetAmount - totalSpent

  const progressWidth = selectedBudgetAmount > 0 ? `${Math.min(100, (totalSpent / selectedBudgetAmount) * 100)}%` : "0%"

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/delete-expense/${id}`, {
      method: "DELETE"
    })

    await loadExpenses()
  }

  const [editId, setEditId] = useState(null)

  return (
    <div className="budget-page">
      <div className="budget-container">
        <h1 className="budget-title">Student Budget Manager</h1>

        <div className="budget-card">
          <h3> Set Monthly Budget</h3>

          <div className="budget-row">
            <input
              className={`budget-field ${budgetError ? 'error' : ''}`}
              type="text"
              placeholder="Enter budget amount (Rs.)"
              value={budget}
              onChange={handleBudgetChange}
            />
            <input
              className={`budget-field ${budgetMonthError ? 'error' : ''}`}
              type="month"
              value={budgetMonth}
              onChange={(e) => {
                setBudgetMonth(e.target.value)
                setBudgetMonthError(validateBudgetMonth(e.target.value))
              }}
            />
            <button
              className="budget-button"
              onClick={handleSaveBudget}
              disabled={!!budgetError || !!budgetMonthError}
            >
              Save Budget
            </button>
          </div>
          {budgetError && <div className="error-message">{budgetError}</div>}
          {budgetMonthError && <div className="error-message">{budgetMonthError}</div>}
          {budgetSuccess && <div className="success-message">{budgetSuccess}</div>}

          <div className="budget-entries">
            <h4>Saved Monthly Budgets</h4>
            {budgetEntries.length === 0 ? (
              <p className="expense-placeholder">No budget entries yet.</p>
            ) : (
              <div className="budget-table-wrapper">
                <table className="budget-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetEntries.map((entry) => (
                      <tr key={entry._id}>
                        <td>{entry.month}</td>
                        <td>Rs. {Number(entry.amount).toLocaleString()}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="action-delete"
                            onClick={async () => {
                              await fetch(`${API_URL}/delete-budget/${entry._id}`, {
                                method: "DELETE"
                              })
                              await loadBudgets()
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="budget-card">
          <h3> Add / Edit Expense</h3>

          {noBudgetError && <div className="error-message">{noBudgetError}</div>}

          <div className="budget-fields">
            <div className="form-group">
              <input
                className={`budget-field ${formErrors.amount ? 'error' : ''}`}
                type="text"
                placeholder="Amount (Rs.)"
                value={form.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
              />
              {formErrors.amount && <div className="error-message">{formErrors.amount}</div>}
            </div>

            <div className="form-group">
              <select
                className={`budget-select ${formErrors.category ? 'error' : ''}`}
                value={form.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
              {formErrors.category && <div className="error-message">{formErrors.category}</div>}
            </div>

            <div className="form-group">
              <input
                className={`budget-field ${formErrors.date ? 'error' : ''}`}
                type="date"
                value={form.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
              />
              {formErrors.date && <div className="error-message">{formErrors.date}</div>}
            </div>

            <div className="form-group">
              <input
                className={`budget-field ${formErrors.notes ? 'error' : ''}`}
                type="text"
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
              <div className="character-count">
                {form.notes.length}/200 characters
              </div>
              {formErrors.notes && <div className="error-message">{formErrors.notes}</div>}
            </div>
          </div>

          <button
            className="action-add"
            onClick={handleAddExpense}
            disabled={Object.values(formErrors).some(error => error !== "")}
          >
            {editId !== null ? "✏️ Update Expense" : "➕ Add Expense"}
          </button>
        </div>

        {/* ✅ Expense List */}
        {/* <div className="budget-card">
  <h3>Expense List</h3>

  {expenses.length === 0 ? (
    <p>No expenses added yet</p>
  ) : (
    <ul>
      {expenses.map((exp, index) => (
        <li key={index}>
          Rs. {exp.amount} - {exp.category} - {exp.date}
        </li>
      ))}
    </ul>
  )}
</div> */}

        <div className="budget-card">
          <h3> Expense List</h3>

          <div className="month-selector">
            <label htmlFor="expense-month">Select Month: </label>
            <input
              id="expense-month"
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                const newMonth = e.target.value
                setSelectedMonth(newMonth)
                loadExpenses(newMonth)
              }}
              className="budget-field"
            />
          </div>

          <div className="budget-metrics">
            <p><strong>Budget for the Month:</strong> Rs. {selectedBudgetAmount.toLocaleString()}</p>
            <p className="budget-total"><strong>Total Spent:</strong> Rs. {totalSpent.toLocaleString()}</p>
            <p className={`budget-balance ${balance >= 0 ? "positive" : "negative"}`}>
              <strong>Balance:</strong> Rs. {balance.toLocaleString()}
            </p>

            <div className="budget-progress">
              <div className="budget-progress-fill" style={{ width: progressWidth }} />
            </div>
          </div>

          {expenses.length === 0 ? (
            <p className="expense-placeholder">No expenses added yet.</p>
          ) : (
            <div className="expense-table-wrapper">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {expenses.map((exp, index) => (
                    <tr key={exp._id}>
                      <td>Rs. {Number(exp.amount).toLocaleString()}</td>
                      <td>{exp.category}</td>
                      <td>{exp.date}</td>
                      <td>{exp.notes}</td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => {
  setForm(exp)
  setEditId(exp._id)
}}>
  Edit
</button>
                        <button
                          className="action-delete"
                          onClick={async () => {
  await fetch(`/api/delete-expense/${exp._id}`, {
    method: "DELETE"
  })

  await loadExpenses()
}}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody> */}
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp._id}>
                      <td>Rs. {Number(exp.amount).toLocaleString()}</td>
                      <td>{exp.category}</td>
                      <td>{exp.date}</td>
                      <td>{exp.notes}</td>
                      <td style={{ textAlign: "center" }}>

                        <button
                          className="action-edit"
                          onClick={() => {
                            setForm(exp)
                            setEditId(exp._id)
                          }}>
                          ✏️ Edit
                        </button>

                        <button
                          className="action-delete"
                          onClick={async () => {
                            await fetch(`${API_URL}/delete-expense/${exp._id}`, {
                              method: "DELETE"
                            })
                            await loadExpenses()
                          }}
                        >
                          🗑️ Delete
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>


            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Budget