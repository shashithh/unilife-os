import { useState } from "react"
import "../styles/MonthlyReport.css"

function MonthlyReport() {
  // Icons for categories
  const categoryIcons = {
    Food: "🍽️",
    Transport: "🚗",
    Bills: "💡",
    Education: "📚",
    Other: "📦"
  }
  // Example data (you can replace with actual expenses later)
  const [expenses, setExpenses] = useState([
    { amount: 500, category: "Food", date: "2026-03-05", notes: "Lunch" },
    { amount: 1200, category: "Transport", date: "2026-03-06", notes: "Bus" },
    { amount: 300, category: "Bills", date: "2026-03-10", notes: "Electricity" },
    { amount: 450, category: "Food", date: "2026-03-12", notes: "Snacks" }
  ])

  // Total spent
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
  const remainingBudget = 10000 - totalSpent

  // Category-wise totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0
    acc[exp.category] += Number(exp.amount)
    return acc
  }, {})

  return (
    <div className="monthly-report-container">
      <div className="monthly-report-card">
        <header className="monthly-report-header">
          <h1> Monthly Report</h1>
          <p>Comprehensive analysis of your monthly spending patterns</p>
          <div className="month-selector">
            <label htmlFor="report-month">Month:</label>
            <input
              id="report-month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="budget-field"
            />
          </div>
        </header>

        <section className="monthly-report-stats">
          <div className="stat-box stat-budget">
            <div className="stat-icon"></div>
            <span>Total Spent</span>
            <strong>Rs. {totalSpent.toLocaleString()}</strong>
          </div>
          <div className="stat-box stat-remaining">
            <div className="stat-icon"></div>
            <span>Remaining</span>
            <strong>Rs. {(10000 - totalSpent).toLocaleString()}</strong>
          </div>
        </section>

        <section className="monthly-report-table-section">
          <h3> Expense Details</h3>
          <table className="monthly-report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, idx) => (
                <tr key={idx}>
                  <td>{exp.date}</td>
                  <td>{exp.category}</td>
                  <td>Rs. {exp.amount}</td>
                  <td>{exp.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="monthly-report-category">
          <h3> Category-wise Breakdown</h3>
          <div className="category-list">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="category-item">
                <div className="category-header">
                  <span className="category-name">{categoryIcons[category] || "📦"} {category}</span>
                  <strong className="category-amount">Rs. {amount.toLocaleString()}</strong>
                </div>
                <div className="category-bar">
                  <div className="category-fill" style={{ width: `${(amount / totalSpent) * 100}%` }}></div>
                </div>
                <span className="category-percentage">{((amount / totalSpent) * 100).toFixed(1)}% of total</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MonthlyReport