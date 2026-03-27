import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  HeartPulse,
  Wallet,
  Calendar,
  Bell,
  User,
  Settings,
  Sparkles
} from "lucide-react";
export function Sidebar() {
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard-placeholder"
    },
    {
      name: "Academic Planner",
      icon: BookOpen,
      path: "/planner-placeholder"
    },
    {
      name: "Group Collaboration",
      icon: Users,
      path: "/collab-placeholder"
    },
    {
      name: "Wellbeing Hub",
      icon: HeartPulse,
      path: "/",
      active: true
    },
    {
      name: "Budget Manager",
      icon: Wallet,
      path: "/budget-placeholder"
    },
    {
      name: "Calendar",
      icon: Calendar,
      path: "/calendar-placeholder"
    }
  ];
  const bottomItems = [
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications-placeholder",
      badge: "3"
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile-placeholder"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings-placeholder"
    }
  ];
  return <aside className="w-64 glass-panel flex flex-col h-full z-20 relative hidden md:flex"><div className="p-6 flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200"><Sparkles className="w-4 h-4 text-white" /></div><span className="font-bold text-xl tracking-tight text-slate-800">
          UniLife<span className="text-indigo-600">OS</span></span></div><div className="flex-1 overflow-y-auto py-4 px-3 space-y-1"><div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
          Main Menu
        </div>{navItems.map(
    (item) => <NavLink
      key={item.name}
      to={item.path}
      className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${item.active || isActive ? "bg-indigo-50 text-indigo-600 font-medium shadow-sm border border-indigo-100/50" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"}
            `}
    ><item.icon
      className={`w-5 h-5 ${item.active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
    /><span className="text-sm">{item.name}</span>{item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}</NavLink>
  )}</div><div className="p-4 border-t border-slate-200/50 space-y-1">{bottomItems.map(
    (item) => <NavLink
      key={item.name}
      to={item.path}
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all duration-200 group"
    ><item.icon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" /><span className="text-sm">{item.name}</span>{item.badge && <span className="ml-auto bg-rose-100 text-rose-600 py-0.5 px-2 rounded-full text-xs font-medium">{item.badge}</span>}</NavLink>
  )}</div></aside>;
}
