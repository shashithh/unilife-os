import { Search, Bell, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
export function Topbar() {
  const location = useLocation();
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.includes("mood")) return "Mood Log";
    if (path.includes("stress")) return "Stress Tracker";
    if (path.includes("analytics")) return "Analytics";
    if (path.includes("support")) return "Anonymous Support";
    if (path.includes("counseling")) return "Counseling";
    if (path.includes("risk")) return "Risk Prediction";
    if (path.includes("chat")) return "AI Chat Support";
    return "Dashboard";
  };
  return <header className="h-16 glass-panel border-r-0 border-b border-white/40 flex items-center justify-between px-6 z-10 relative"><div className="flex items-center text-sm"><span className="text-slate-400">Wellbeing Hub</span><ChevronRight className="w-4 h-4 mx-2 text-slate-300" /><span className="font-medium text-slate-800">{getBreadcrumb()}</span></div><div className="flex items-center gap-4"><div className="relative hidden md:block"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input
    type="text"
    placeholder="Search resources..."
    className="pl-9 pr-4 py-2 bg-white/50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all"
  /></div><button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"><Bell className="w-5 h-5" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" /></button><div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center overflow-hidden cursor-pointer"><img
    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
    alt="Profile"
    className="w-full h-full object-cover"
  /></div></div></header>;
}
