import React from 'react';
import { NavLink } from 'react-router-dom';
export function PlannerNav() {
  const links = [
  {
    name: 'Overview',
    path: '/'
  },
  {
    name: 'Tasks',
    path: '/tasks'
  },
  {
    name: 'AI Scheduler',
    path: '/ai-scheduler'
  },
  {
    name: 'Weekly Plan',
    path: '/weekly-plan'
  },
  {
    name: 'Calendar',
    path: '/calendar'
  },
  {
    name: 'Productivity',
    path: '/productivity'
  },
  {
    name: 'Alerts',
    path: '/alerts'
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