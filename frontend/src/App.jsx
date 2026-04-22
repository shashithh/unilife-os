import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

// Auth
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';

// Main System
import { HomePage } from './pages/HomePage';
import { MainDashboard } from './pages/main/MainDashboard';

// Planner Pages
import { Dashboard } from './pages/planner/Dashboard';
import { TaskList } from './pages/planner/TaskList';
import { AddTask } from './pages/planner/AddTask';
import { AddSubject } from './pages/planner/AddSubject';
import { AIScheduler } from './pages/planner/AIScheduler';
import { WeeklyPlan } from './pages/planner/WeeklyPlan';
import { Calendar } from './pages/planner/Calendar';
import { Productivity } from './pages/planner/Productivity';
import { Alerts } from './pages/planner/Alerts';

// Wellbeing Pages
import { WellbeingDashboard } from './pages/wellbeing/WellbeingDashboard';
import { DailyMoodLog } from './pages/wellbeing/DailyMoodLog';
import { StressTracker } from './pages/wellbeing/StressTracker';
import { MoodAnalytics } from './pages/wellbeing/MoodAnalytics';
import { AnonymousSupportRequest } from './pages/wellbeing/AnonymousSupportRequest';
import { CounselingBooking } from './pages/wellbeing/CounselingBooking';
import { CounselorSlotSelection } from './pages/wellbeing/CounselorSlotSelection';
import { AIRiskPrediction } from './pages/wellbeing/AIRiskPrediction';
import { AIChatSupport } from './pages/wellbeing/AIChatSupport';
import { CounselorDashboard } from './pages/wellbeing/CounselorDashboard';

// Budget Pages
import { BudgetDashboard } from './pages/budget/BudgetDashboard';
import { AddExpense } from './pages/budget/AddExpense';
import { ExpenseHistory } from './pages/budget/ExpenseHistory';
import { BudgetInsights } from './pages/budget/BudgetInsights';
import { BudgetAlerts } from './pages/budget/BudgetAlerts';
import { BudgetSettings } from './pages/budget/BudgetSettings';
import { BudgetMonthlyBudget } from './pages/budget/BudgetMonthlyBudget';
import { AddIncome } from './pages/budget/AddIncome';

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute allowedRoles={["Student", "Counselor", "Admin"]} />}>
          <Route element={<AppShell />}>

            <Route element={<ProtectedRoute allowedRoles={["Counselor"]} />}>
              <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["Student", "Admin"]} />}>
              {/* Main System Routes */}
              <Route path="/dashboard" element={<MainDashboard />} />

              {/* Planner Module Routes */}
              <Route path="/planner" element={<Dashboard />} />
              <Route path="/planner/tasks" element={<TaskList />} />
              <Route path="/planner/add-task" element={<AddTask />} />
              <Route path="/planner/add-subject" element={<AddSubject />} />
              <Route path="/planner/ai-scheduler" element={<AIScheduler />} />
              <Route path="/planner/weekly-plan" element={<WeeklyPlan />} />
              <Route path="/planner/calendar" element={<Calendar />} />
              <Route path="/planner/productivity" element={<Productivity />} />
              <Route path="/planner/alerts" element={<Alerts />} />

              {/* Wellbeing Hub Module Routes */}
              <Route path="/wellbeing" element={<WellbeingDashboard />} />
              <Route path="/wellbeing/mood" element={<DailyMoodLog />} />
              <Route path="/wellbeing/stress" element={<StressTracker />} />
              <Route path="/wellbeing/analytics" element={<MoodAnalytics />} />
              <Route path="/wellbeing/support" element={<AnonymousSupportRequest />} />
              <Route path="/wellbeing/counseling" element={<CounselingBooking />} />
              <Route path="/wellbeing/counseling/book/:id" element={<CounselorSlotSelection />} />
              <Route path="/wellbeing/risk" element={<AIRiskPrediction />} />
              <Route path="/wellbeing/chat" element={<AIChatSupport />} />

              {/* Budget Module Routes */}
              <Route path="/budget" element={<BudgetDashboard />} />
              <Route path="/budget/add" element={<AddExpense />} />
              <Route path="/budget/add-income" element={<AddIncome />} />
              <Route path="/budget/history" element={<ExpenseHistory />} />
              <Route path="/budget/insights" element={<BudgetInsights />} />
              <Route path="/budget/alerts" element={<BudgetAlerts />} />
              <Route path="/budget/settings" element={<BudgetSettings />} />
              <Route path="/budget/monthly-budget" element={<BudgetMonthlyBudget />} />

              {/* Placeholders for other UniLife OS modules */}
              <Route
                path="/groups"
                element={
                  <div className="p-8 text-center text-gray-500">
                    Group Collaboration Module (Coming Soon)
                  </div>
                } />

            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;