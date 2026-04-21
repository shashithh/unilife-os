import React from 'react';
import { NavLink } from 'react-router-dom';
export function PlannerNav() {
  const links = [
  {
    name: 'Overview',
    path: '/planner'
  },
  {
    name: 'Tasks',
    path: '/planner/tasks'
  },
  {
    name: 'AI Scheduler',
    path: '/planner/ai-scheduler'
  },
  {
    name: 'Weekly Plan',
    path: '/planner/weekly-plan'
  },
  {
    name: 'Calendar',
    path: '/planner/calendar'
  },
  {
    name: 'Productivity',
    path: '/planner/productivity'
  },
  {
    name: 'Alerts',
    path: '/planner/alerts'
  }];

  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {links.map((link) =>
      <NavLink
        key={link.name}
        to={link.path}
        className={({ isActive }) => `
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${isActive ? 'bg-white shadow-sm text-blue-600 ring-1 ring-gray-200' : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'}
          `}>
        
          {link.name}
        </NavLink>
      )}
    </div>);

}