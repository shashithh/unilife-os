import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
export function AppLayout() {
  return <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900 relative">{
    /* Decorative background blobs for the premium SaaS feel */
  }<div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none"><div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[100px] mix-blend-multiply" /><div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/30 blur-[100px] mix-blend-multiply" /><div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-200/30 blur-[120px] mix-blend-multiply" /></div><Sidebar /><div className="flex-1 flex flex-col h-screen overflow-hidden relative"><Topbar /><main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth"><div className="max-w-6xl mx-auto animate-fade-in"><Outlet /></div></main></div></div>;
}
