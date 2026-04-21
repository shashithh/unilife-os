import React from 'react';
import { NavLink } from 'react-router-dom';
export function BudgetNav() {
  const links = [
  {
    name: 'Overview',
    path: '/budget'
  },
  {
    name: 'History',
    path: '/budget/history'
  },
  {
    name: 'Insights',
    path: '/budget/insights'
  },
  {
    name: 'Alerts',
    path: '/budget/alerts'
  },
  {
    name: 'Settings',
    path: '/budget/settings'
  }];

  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {links.map((link) =>
      <NavLink
        key={link.name}
        to={link.path}
        end={link.path === '/budget'}
        className={({ isActive }) => `
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${isActive ? 'bg-white shadow-sm text-teal-600 ring-1 ring-gray-200' : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'}
          `}>
        
          {link.name}
        </NavLink>
      )}
    </div>);

}