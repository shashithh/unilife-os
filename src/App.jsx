import { useState } from "react"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Budget from "./pages/Budget"
import Alerts from "./pages/Alerts"
import MonthlyReport from "./pages/MonthlyReport"
import Dashboard from "./pages/Dashboard"

function App() {
  const [activePage, setActivePage] = useState("Budget")

  const renderPage = () => {
    switch (activePage) {
      case "Budget":
        return <Budget />
      case "Dashboard":
        return <Dashboard />
      case "Alerts":
        return <Alerts />
      case "MonthlyReport":
        return <MonthlyReport />
      default:
        return <Budget />
    }
  }

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </MainLayout>
  )
}

export default App
