import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  BrainCircuit,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Calendar as CalendarIcon,
  Sparkles,
  HeartPulse,
  LayoutDashboard,
  Users,
  Wallet
} from 'lucide-react';

export function MainDashboard() {
  const navigate = useNavigate();

  const [integrationStats, setIntegrationStats] = useState({
    pendingTasks: 0,
    criticalTasks: 0,
    latestMood: "Not logged",
    latestStressLevel: "Not logged",
    burnoutRisk: "Low",
    recommendation: "Loading recommendations..."
  });

  const userName = JSON.parse(localStorage.getItem("user") || "{}").fullName?.split(' ')[0] || "Student";

  useEffect(() => {
    fetch('/api/integration/student-overview')
      .then((res) => res.json())
      .then(setIntegrationStats)
      .catch((err) => console.error('Integration fetch error:', err));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to UniLife OS, {userName}! 👋
        </h1>
        <p className="text-gray-600">
          Your centralized command center for academics, wellbeing, and campus life.
        </p>
      </div>

      {/* Wellness & Academic Integration Overview */}
      <div className="mb-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-300"/> Overall Status
              </h2>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm ${integrationStats.burnoutRisk === 'High' ? 'bg-red-500 text-white' : integrationStats.burnoutRisk === 'Moderate' ? 'bg-orange-400 text-white' : 'bg-teal-400 text-white'}`}>
                Burnout Risk: {integrationStats.burnoutRisk}
              </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                  <p className="text-indigo-100 text-sm font-medium mb-1">Today's Mood</p>
                  <p className="text-3xl font-bold">{integrationStats.latestMood}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                  <p className="text-indigo-100 text-sm font-medium mb-1">Stress Level</p>
                  <p className="text-3xl font-bold">{integrationStats.latestStressLevel}/10</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                  <p className="text-indigo-100 text-sm font-medium mb-1">Pending Tasks</p>
                  <p className="text-3xl font-bold">{integrationStats.pendingTasks}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                  <p className="text-indigo-100 text-sm font-medium mb-1">Critical Tasks</p>
                  <p className="text-3xl font-bold">{integrationStats.criticalTasks}</p>
              </div>
          </div>
          <div className="bg-indigo-900/40 backdrop-blur-sm p-5 rounded-2xl border border-indigo-400/30 flex items-start gap-4">
              <BrainCircuit className="w-6 h-6 text-indigo-300 shrink-0 mt-0.5" />
              <p className="text-[15px] leading-relaxed text-indigo-50"><strong>AI Insight:</strong> {integrationStats.recommendation}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
      
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/planner')}
          className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Academic Planner</h3>
          <p className="text-sm text-gray-500">Manage tasks, deadlines, and view AI-optimized schedules.</p>
        </div>

        <div 
          onClick={() => navigate('/wellbeing')}
          className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Wellbeing Hub</h3>
          <p className="text-sm text-gray-500">Track your mood, manage stress, and get counseling support.</p>
        </div>

        <div 
          onClick={() => navigate('/groups')}
          className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Group Collaboration</h3>
          <p className="text-sm text-gray-500">Engage with your peers in collaborative projects. (Coming Soon)</p>
        </div>

        <div 
          onClick={() => navigate('/budget')}
          className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Budget Manager</h3>
          <p className="text-sm text-gray-500">Track expenses and manage your university finances. (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}
