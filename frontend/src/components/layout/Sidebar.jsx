import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  HeartPulse,
  Wallet,
  Calendar as CalendarIcon,
  Bell,
  User,
  Settings,
  Sparkles
} from
  'lucide-react';
export function Sidebar() {
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <CheckSquare size={20} />,
      label: 'Academic Planner',
      path: '/',
      active: true
    },
    {
      icon: <Users size={20} />,
      label: 'Group Collaboration',
      path: '/groups'
    },
    {
      icon: <HeartPulse size={20} />,
      label: 'Wellbeing Hub',
      path: '/wellbeing'
    },
    {
      icon: <Wallet size={20} />,
      label: 'Budget Manager',
      path: '/budget'
    }];

  const bottomItems = [
    {
      icon: <CalendarIcon size={20} />,
      label: 'Calendar',
      path: '/calendar'
    },
    {
      icon: <Bell size={20} />,
      label: 'Notifications',
      path: '/alerts'
    },
    {
      icon: <User size={20} />,
      label: 'Profile',
      path: '/profile'
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      path: '/settings'
    }];

  return (
    <aside className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          UniLife OS
        </span>
      </div>

      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Modules
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) =>
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${item.active || isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}>

            <span className={item.active ? 'text-blue-600' : 'text-gray-400'}>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        )}

        <div className="mt-8 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          System
        </div>

        {bottomItems.map((item) =>
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}>

            <span className="text-gray-400">{item.icon}</span>
            {item.label}
          </NavLink>
        )}
      </nav>

      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white shadow-sm overflow-hidden">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="Student"
              className="w-full h-full object-cover" />

          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Biseka Mavindi</p>
            <p className="text-xs text-gray-500">Information Technology</p>
          </div>
        </div>
      </div>
    </aside>);

}