import React, { useState } from "react"
import { Pie, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"
import "../styles/Dashboard.css"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

function Dashboard() {
  const expenses = [
    { amount: 500, category: "Food", date: "2026-03-05", notes: "Lunch" },
    { amount: 1200, category: "Transport", date: "2026-03-06", notes: "Bus" },
    { amount: 300, category: "Bills", date: "2026-03-10", notes: "Electricity" },
    { amount: 450, category: "Food", date: "2026-03-12", notes: "Snacks" },
    { amount: 700, category: "Education", date: "2026-03-15", notes: "Books" }
  ]

  // Validation: Check if expenses data exists and is valid
  const isValidExpenses = Array.isArray(expenses) && expenses.length > 0
  
  // Validation: Filter out invalid expense entries
  const validatedExpenses = isValidExpenses 
    ? expenses.filter(exp => 
        exp && 
        typeof exp.amount === 'number' && 
        exp.amount > 0 && 
        exp.category && 
        exp.date
      )
    : []

  const hasExpenses = validatedExpenses.length > 0

  const totalSpent = hasExpenses 
    ? validatedExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
    : 0

  const categoryTotals = hasExpenses
    ? validatedExpenses.reduce((acc, e) => {
        if (!acc[e.category]) acc[e.category] = 0
        acc[e.category] += Number(e.amount)
        return acc
      }, {})
    : {}

  // Validation: Ensure chart data is valid
  const categoryLabels = Object.keys(categoryTotals)
  const categoryValues = Object.values(categoryTotals)
  const hasValidChartData = categoryLabels.length > 0 && categoryValues.length > 0

  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Spending by Category",
        data: categoryValues,
        backgroundColor: [
          "#667eea",
          "#764ba2",
          "#f093fb",
          "#f5576c",
          "#4facfe",
          "#00f2fe",
          "#43e97b",
          "#38f9d7"
        ],
        borderColor: [
          "#5a67d8",
          "#6b46c1",
          "#d53f8c",
          "#e53e3e",
          "#3182ce",
          "#00bcd4",
          "#38a169",
          "#319795"
        ],
        borderWidth: 2,
        hoverOffset: 8,
      }
    ]
  }

  const dailyTotals = {}
  hasExpenses && validatedExpenses.forEach(e => {
    // Validation: Check if date is valid format
    if (e.date && typeof e.date === 'string') {
      dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount
    }
  })

  const dailyLabels = Object.keys(dailyTotals)
  const dailyValues = Object.values(dailyTotals)
  const hasValidBarData = dailyLabels.length > 0 && dailyValues.length > 0

  const barData = {
    labels: dailyLabels,
    datasets: [
      {
        label: "Daily Spending",
        data: dailyValues,
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderColor: "#5a67d8",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: "#764ba2",
        hoverBorderColor: "#6b46c1",
        hoverBorderWidth: 3,
      }
    ]
  }

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const budget = 10000
  const remainingBudget = budget - totalSpent

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <h1>Financial Dashboard</h1>
          <p>Track your spending patterns and budget performance</p>
          <div className="month-selector">
            <label htmlFor="dashboard-month">Month:</label>
            <input
              id="dashboard-month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="budget-field"
            />
          </div>
        </header>

        {!hasExpenses ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>No Expenses Yet</h2>
            <p>Start adding expenses to see your spending breakdown</p>
          </div>
        ) : (
          <>
            <section className="dashboard-summary">
              <div className="summary-block">
                <div className="summary-icon"></div>
                <span>Total Spent</span>
                <strong>Rs. {totalSpent.toLocaleString()}</strong>
              </div>
              <div className="summary-block summary-remaining">
                <div className="summary-icon"></div>
                <span>Remaining Budget</span>
                <strong>Rs. {remainingBudget.toLocaleString()}</strong>
              </div>
            </section>

            <section className="dashboard-charts">
              {hasValidChartData ? (
                <>
                  <div className="chart-panel">
                    <h4>Category Breakdown</h4>
                    <Pie data={pieData} />
                  </div>
                  <div className="chart-panel">
                    <h4> Daily Spending Trend</h4>
                    <Bar data={barData} />
                  </div>
                </>
              ) : (
                <div className="chart-error">⚠️ Unable to load chart data. Please check your expenses.</div>
              )}
            </section>

            <section className="dashboard-table-section">
              <h3> Recent Transactions</h3>
              {validatedExpenses.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validatedExpenses.map((e, idx) => (
                      <tr key={idx}>
                        <td>{e.date || "N/A"}</td>
                        <td>{e.category || "Unknown"}</td>
                        <td>Rs. {Number(e.amount || 0).toFixed(2)}</td>
                        <td>{e.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="table-empty">No valid transactions to display</div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard