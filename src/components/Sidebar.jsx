import "../styles/Sidebar.css"

function Sidebar({ activePage, setActivePage }) {
  const navigationItems = [
    { name: "Budget", page: "Budget" },
    { name: "Dashboard", page: "Dashboard" },
    { name: "Alerts", page: "Alerts" },
    { name: "Monthly Report", page: "MonthlyReport" }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-title">Budget Module</div>
      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <button
            key={item.page}
            className={`sidebar-link ${activePage === item.page ? "active" : ""}`}
            onClick={() => setActivePage(item.page)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
