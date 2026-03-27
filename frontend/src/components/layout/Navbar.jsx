import React from 'react';
import { Search, Bell, ChevronRight, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Navbar({ onMenuClick }) {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/tasks') return 'Task List';
    if (path === '/add-task') return 'Add Task';
    if (path === '/add-subject') return 'Add Subject';
    if (path === '/ai-scheduler') return 'AI Study Scheduler';
    if (path === '/weekly-plan') return 'Weekly Plan';
    if (path === '/calendar') return 'Calendar';
    if (path === '/productivity') return 'Productivity Insights';
    if (path === '/alerts') return 'Alerts & Reminders';
    return 'Dashboard';
  };

  return (
    <header className="h-16 bg-white/60 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center text-sm font-medium text-gray-500">
          <span>UniLife OS</span>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-900">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, subjects..."
            className="pl-9 pr-4 py-1.5 bg-white/80 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
