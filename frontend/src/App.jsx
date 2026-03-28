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