import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Dashboard } from './pages/planner/Dashboard';
import { Profile } from './pages/profile/Profile';
import { GroupCollaboration } from './pages/groups/GroupCollaboration';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<div className="p-8 text-center text-gray-500">Calendar (Coming Soon)</div>} />
          <Route path="/tasks" element={<div className="p-8 text-center text-gray-500">Academic Planner (Coming Soon)</div>} />
          <Route path="/groups" element={<GroupCollaboration />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/wellbeing" element={<div className="p-8 text-center text-gray-500">Wellbeing Hub (Coming Soon)</div>} />
          <Route path="/budget" element={<div className="p-8 text-center text-gray-500">Budget Manager (Coming Soon)</div>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
