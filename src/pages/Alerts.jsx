import { useEffect, useState } from "react"
import "../styles/Alert.css"

function Alerts() {
  const [savedBudget, setSavedBudget] = useState(10000)
  const [totalSpent, setTotalSpent] = useState(7500)
  const [threshold, setThreshold] = useState(70)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const percentageUsed = (totalSpent / savedBudget) * 100

  useEffect(() => {
    if (percentageUsed >= threshold) {
      setShowAlert(true)
    } else {
      setShowAlert(false)
    }
  }, [percentageUsed, threshold])

  const remainingBudget = savedBudget - totalSpent
  const usageMessage =
    percentageUsed >= 100
      ? { text: "Budget exceeded! Stop spending.", color: "#c0392b", background: "#ffebee", icon: "" }
      : percentageUsed >= threshold
      ? { text: " You are nearing your budget limit.", color: "#d35400", background: "#fcf3e4", icon: "" }
      : { text: "You are within your budget. Keep going!", color: "#16a085", background: "#e9f7ef", icon: "" }

  return (
    <div className="alerts-page">
      <div className="alerts-container">
        <div className="alerts-card">
          <header className="alerts-header">
            <h1> Budget Alerts</h1>
            <p>Monitor your spending and stay within budget limits</p>
            <div className="month-selector">
              <label htmlFor="alerts-month">Month:</label>
              <input
                id="alerts-month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="budget-field"
              />
            </div>
          </header>

          <div className="alerts-content">
            <div className="alerts-metrics">
              <div className="metric-card">
                <div className="metric-icon"></div>
                <div className="metric-info">
                  <span className="metric-label">Total Budget</span>
                  <span className="metric-value">Rs. {savedBudget.toLocaleString()}</span>
                </div>
              </div>

              <div className="metric-card spent">
                <div className="metric-icon"></div>
                <div className="metric-info">
                  <span className="metric-label">Total Spent</span>
                  <span className="metric-value">Rs. {totalSpent.toLocaleString()}</span>
                </div>
              </div>

              <div className="metric-card remaining">
                <div className="metric-icon"></div>
                <div className="metric-info">
                  <span className="metric-label">Remaining</span>
                  <span className="metric-value">Rs. {remainingBudget.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="alerts-progress-section">
              <div className="progress-header">
                <span className="progress-title"> Budget Usage</span>
                <span className="progress-percentage">{percentageUsed.toFixed(1)}%</span>
              </div>

              <div className="alerts-progress-bar">
                <div
                  className="alerts-progress-fill"
                  style={{
                    width: `${Math.min(percentageUsed, 100)}%`,
                    background:
                      percentageUsed >= 100
                        ? "linear-gradient(90deg, #d35400 0%, #e74c3c 100%)"
                        : percentageUsed >= threshold
                        ? "linear-gradient(90deg, #f39c12 0%, #e67e22 100%)"
                        : "linear-gradient(90deg, #5dade2 0%, #3498db 100%)"
                  }}
                ></div>
              </div>

              <div className="progress-details">
                <span>Used: Rs. {totalSpent.toLocaleString()}</span>
                <span>Remaining: Rs. {Math.max(0, remainingBudget).toLocaleString()}</span>
              </div>
            </div>

            <div className="alerts-status">
              <div className="status-icon">{usageMessage.icon}</div>
              <div className="status-content">
                <h3>Status Alert</h3>
                <p>{usageMessage.text}</p>
              </div>
            </div>

            <div className="alerts-actions">
              {/* <button className="alerts-button btn-primary">
                 View Detailed Report
              </button>
              <button className="alerts-button btn-secondary">
                 Adjust Threshold
              </button>
              <button className="alerts-button btn-warning">
                Reset Budget
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts