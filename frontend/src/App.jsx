<<<<<<< HEAD
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
// Pages
import { Dashboard } from './pages/planner/Dashboard';
import { TaskList } from './pages/planner/TaskList';
import { AddTask } from './pages/planner/AddTask';
import { AddSubject } from './pages/planner/AddSubject';
import { AIScheduler } from './pages/planner/AIScheduler';
import { WeeklyPlan } from './pages/planner/WeeklyPlan';
import { Calendar } from './pages/planner/Calendar';
import { Productivity } from './pages/planner/Productivity';
import { Alerts } from './pages/planner/Alerts';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          {/* Planner Module Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/ai-scheduler" element={<AIScheduler />} />
          <Route path="/weekly-plan" element={<WeeklyPlan />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/productivity" element={<Productivity />} />
          <Route path="/alerts" element={<Alerts />} />

          {/* Placeholders for other UniLife OS modules */}
          <Route
            path="/groups"
            element={
              <div className="p-8 text-center text-gray-500">
                Group Collaboration Module (Coming Soon)
              </div>
            } />

          <Route
            path="/wellbeing"
            element={
              <div className="p-8 text-center text-gray-500">
                Wellbeing Hub Module (Coming Soon)
              </div>
            } />

          <Route
            path="/budget"
            element={
              <div className="p-8 text-center text-gray-500">
                Budget Manager Module (Coming Soon)
              </div>
            } />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>);

}
export default App;
=======
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { WellbeingDashboard } from "./pages/WellbeingDashboard";
import { DailyMoodLog } from "./pages/DailyMoodLog";
import { StressTracker } from "./pages/StressTracker";
import { MoodAnalytics } from "./pages/MoodAnalytics";
import { AnonymousSupportRequest } from "./pages/AnonymousSupportRequest";
import { CounselingBooking } from "./pages/CounselingBooking";
import { CounselorSlotSelection } from "./pages/CounselorSlotSelection";
import { AIRiskPrediction } from "./pages/AIRiskPrediction";
import { AIChatSupport } from "./pages/AIChatSupport";
const PlaceholderPage = ({ title }) => <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-fade-in"><h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2><p>This module is part of the broader UniLife OS platform.</p><p className="text-sm mt-4 text-indigo-500">
      Navigate to "Wellbeing Hub" to see the generated frontend.
    </p></div>;
export function App() {
  return <Router><Routes><Route element={<AppLayout />}>{
    /* Wellbeing Hub Routes */
  }<Route path="/" element={<WellbeingDashboard />} /><Route path="/mood" element={<DailyMoodLog />} /><Route path="/stress" element={<StressTracker />} /><Route path="/analytics" element={<MoodAnalytics />} /><Route path="/support" element={<AnonymousSupportRequest />} /><Route path="/counseling" element={<CounselingBooking />} /><Route
    path="/counseling/book/:id"
    element={<CounselorSlotSelection />}
  /><Route path="/risk" element={<AIRiskPrediction />} /><Route path="/chat" element={<AIChatSupport />} />{
    /* UniLife OS Shell Placeholders */
  }<Route
    path="/dashboard-placeholder"
    element={<PlaceholderPage title="Main Dashboard" />}
  /><Route
    path="/planner-placeholder"
    element={<PlaceholderPage title="Academic Planner" />}
  /><Route
    path="/collab-placeholder"
    element={<PlaceholderPage title="Group Collaboration" />}
  /><Route
    path="/budget-placeholder"
    element={<PlaceholderPage title="Budget Manager" />}
  /><Route
    path="/calendar-placeholder"
    element={<PlaceholderPage title="Calendar" />}
  /><Route
    path="/notifications-placeholder"
    element={<PlaceholderPage title="Notifications" />}
  /><Route
    path="/profile-placeholder"
    element={<PlaceholderPage title="Profile" />}
  /><Route
    path="/settings-placeholder"
    element={<PlaceholderPage title="Settings" />}
  />{
    /* Catch-all */
  }<Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></Router>;
}
>>>>>>> ea163fd0e8677a6b312d155408fea424ad87be78
