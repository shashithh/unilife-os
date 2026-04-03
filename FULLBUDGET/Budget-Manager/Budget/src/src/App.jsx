import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
// Budget Pages
import { BudgetDashboard } from './pages/budget/BudgetDashboard';
import { AddExpense } from './pages/budget/AddExpense';
import { ExpenseHistory } from './pages/budget/ExpenseHistory';
import { BudgetInsights } from './pages/budget/BudgetInsights';
import { BudgetAlerts } from './pages/budget/BudgetAlerts';
import { BudgetSettings } from './pages/budget/BudgetSettings';
import { BudgetMonthlyBudget } from './pages/budget/BudgetMonthlyBudget';
export function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          {/* Default route → Budget Manager */}
          <Route path="/" element={<Navigate to="/budget" replace />} />

          {/* Budget Module Routes */}
          <Route path="/budget" element={<BudgetDashboard />} />
          <Route path="/budget/add" element={<AddExpense />} />
          <Route path="/budget/history" element={<ExpenseHistory />} />
          <Route path="/budget/insights" element={<BudgetInsights />} />
          <Route path="/budget/alerts" element={<BudgetAlerts />} />
          <Route path="/budget/settings" element={<BudgetSettings />} />
          <Route path="/budget/monthly-budget" element={<BudgetMonthlyBudget />} />

          <Route path="*" element={<Navigate to="/budget" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>);

    

}