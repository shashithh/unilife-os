import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  Wallet,
  CalendarDays,
  Bell,
  User,
  Settings,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const modules = [
  {
    icon: <LayoutDashboard className="w-7 h-7" />,
    label: 'Dashboard',
    description: 'Overview of your tasks, deadlines, and productivity at a glance.',
    path: '/',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
    badge: null,
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    label: 'Academic Planner',
    description: 'Manage assignments, deadlines, and study sessions efficiently.',
    path: '/tasks',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-100',
    badge: null,
  },
  {
    icon: <Users className="w-7 h-7" />,
    label: 'Group Collaboration',
    description: 'Work together with classmates on shared projects and assignments.',
    path: '/groups',
    gradient: 'from-teal-500 to-cyan-600',
    bg: 'from-teal-50 to-cyan-50',
    border: 'border-teal-100',
    badge: null,
  },
  {
    icon: <HeartPulse className="w-7 h-7" />,
    label: 'Wellbeing Hub',
    description: 'Track your mental health, mood, and maintain a healthy study-life balance.',
    path: '/wellbeing',
    gradient: 'from-pink-500 to-rose-500',
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-100',
    badge: 'Soon',
  },
  {
    icon: <Wallet className="w-7 h-7" />,
    label: 'Budget Manager',
    description: 'Manage your student finances, track expenses, and set savings goals.',
    path: '/budget',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    badge: 'Soon',
  },
];

const systemLinks = [
  {
    icon: <CalendarDays className="w-5 h-5" />,
    label: 'Calendar',
    description: 'View deadlines and study sessions.',
    path: '/calendar',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    icon: <Bell className="w-5 h-5" />,
    label: 'Notifications',
    description: 'Alerts, reminders, and updates.',
    path: '/alerts',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    icon: <User className="w-5 h-5" />,
    label: 'Profile',
    description: 'Manage your account and preferences.',
    path: '/profile',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings',
    description: 'Customize your UniLife OS experience.',
    path: '/settings',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 md:p-16 text-white shadow-2xl shadow-blue-500/30">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/80 font-semibold text-lg tracking-wide">UniLife OS</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Your all-in-one<br />student operating system.
          </h1>
          <p className="text-white/75 text-lg mb-8 leading-relaxed">
            Manage tasks, collaborate with peers, track your wellbeing, and stay on top of your budget — all in one place.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="glass"
              size="lg"
              icon={<BookOpen className="w-5 h-5" />}
              onClick={() => navigate('/tasks')}
            >
              Academic Planner
            </Button>
            <button
              onClick={() => navigate('/groups')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold text-base hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-md"
            >
              <Users className="w-5 h-5" />
              Collaborate
            </button>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Modules</h2>
          <p className="text-gray-500 mt-1">Everything you need for student life.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => (
            <button
              key={mod.label}
              onClick={() => navigate(mod.path)}
              className={`group relative text-left rounded-2xl border ${mod.border} bg-gradient-to-br ${mod.bg} p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
            >
              {mod.badge && (
                <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 text-gray-500 border border-gray-200">
                  {mod.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.gradient} text-white flex items-center justify-center mb-4 shadow-md`}>
                {mod.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{mod.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{mod.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                Open <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* System */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">System</h2>
          <p className="text-gray-500 mt-1">Manage your account and app settings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-400 truncate">{item.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
