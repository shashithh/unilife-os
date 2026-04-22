import React from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
export function Navbar() {
  const location = useLocation();
  const getModule = () => {
    const path = location.pathname;
    if (path.startsWith('/planner')) return 'Academic Planner';
    if (path.startsWith('/wellbeing')) return 'Wellbeing Hub';
    if (path === '/dashboard') return 'UniLife OS';
    return 'System';
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Main Dashboard';
    if (path === '/planner') return 'Dashboard';
    if (path === '/planner/tasks') return 'Task List';
    if (path === '/planner/add-task') return 'Add Task';
    if (path === '/planner/add-subject') return 'Subjects';
    if (path === '/planner/ai-scheduler') return 'AI Study Scheduler';
    if (path === '/planner/weekly-plan') return 'Weekly Plan';
    if (path === '/planner/calendar') return 'Calendar';
    if (path === '/planner/productivity') return 'Productivity Insights';
    if (path === '/planner/alerts') return 'Alerts & Reminders';
    if (path === '/wellbeing') return 'Dashboard';
    if (path === '/wellbeing/mood') return 'Daily Mood Log';
    if (path === '/wellbeing/stress') return 'Stress Tracker';
    if (path === '/wellbeing/analytics') return 'Mood Analytics';
    if (path === '/wellbeing/support') return 'Anonymous Support';
    if (path === '/wellbeing/counseling') return 'Counseling';
    if (path === '/wellbeing/risk') return 'Risk Prediction';
    if (path === '/wellbeing/chat') return 'AI Chat Support';
    return 'Dashboard';
  };
  return (
    <header className="h-16 bg-white/60 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center text-sm font-medium text-gray-500">
        <span>{getModule()}</span>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-900">{getBreadcrumb()}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, subjects..."
            className="pl-9 pr-4 py-1.5 bg-white/80 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all" />
          
        </div>

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>);

}