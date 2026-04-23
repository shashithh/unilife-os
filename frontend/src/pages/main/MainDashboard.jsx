import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, CheckCircle2, Sparkles, HeartPulse,
  Wallet, TrendingDown, Plus, ArrowRight
} from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n || 0);
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

export function MainDashboard() {
  const navigate = useNavigate();
  const userName = JSON.parse(localStorage.getItem('user') || '{}').fullName?.split(' ')[0] || 'Student';

  const [integrationStats, setIntegrationStats] = useState({
    pendingTasks: 0, criticalTasks: 0,
    latestMood: 'Not logged', latestStressLevel: 'Not logged',
    burnoutRisk: 'Low', recommendation: 'Loading recommendations...',
    nextSessionCounselor: null, nextSessionDate: null
  });

  const [budgetSummary, setBudgetSummary] = useState(null);

  useEffect(() => {
    // Academic + Wellbeing integration data
    fetch('/api/integration/student-overview', { headers: authH() })
      .then(r => r.json()).then(setIntegrationStats)
      .catch(e => console.error('Integration fetch error:', e));

    // Budget summary
    const month = new Date().toISOString().slice(0, 7);
    Promise.all([
      fetch('/api/budget/dashboard', { headers: authH() }).then(r => r.json()).catch(() => null),
      fetch('/api/budget/expenses', { headers: authH() }).then(r => r.json()).catch(() => []),
      fetch(`/api/budget/settings/monthly/${month}`, { headers: authH() }).then(r => r.json()).catch(() => null),
    ]).then(([dash, expenses, monthBudget]) => {
      const monthExp = (expenses || []).filter(e => new Date(e.date).toISOString().slice(0, 7) === month);
      const totalSpent = monthExp.reduce((s, e) => s + e.amount, 0);
      const budget = monthBudget?.monthlyBudget || dash?.monthlyBudget || 0;
      setBudgetSummary({ totalSpent, budget, remaining: budget - totalSpent, count: monthExp.length });
    });

  }, []);

  const budgetPct = budgetSummary?.budget > 0 ? Math.round((budgetSummary.totalSpent / budgetSummary.budget) * 100) : 0;

  const modules = [
    {
      path: '/planner', hover: 'hover:border-blue-300', icon: <CheckCircle2 className="w-6 h-6" />,
      iconBg: 'bg-blue-50 text-blue-600', title: 'Academic Planner',
      desc: 'Manage tasks, deadlines, and AI-optimized schedules.',
      badge: integrationStats.pendingTasks > 0 ? `${integrationStats.pendingTasks} pending` : null,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      path: '/wellbeing', hover: 'hover:border-rose-300', icon: <HeartPulse className="w-6 h-6" />,
      iconBg: 'bg-rose-50 text-rose-600', title: 'Wellbeing Hub',
      desc: 'Track mood, manage stress, and book counseling sessions.',
      badge: integrationStats.nextSessionCounselor ? `Session: ${integrationStats.nextSessionDate}` : null,
      badgeColor: 'bg-rose-100 text-rose-700'
    },

    {
      path: '/budget', hover: 'hover:border-teal-300', icon: <Wallet className="w-6 h-6" />,
      iconBg: 'bg-teal-50 text-teal-600', title: 'Budget Manager',
      desc: 'Track expenses, set budgets, and get spending insights.',
      badge: budgetSummary !== null ? `${budgetPct}% used this month` : null,
      badgeColor: budgetPct >= 100 ? 'bg-red-100 text-red-700' : budgetPct >= 80 ? 'bg-orange-100 text-orange-700' : 'bg-teal-100 text-teal-700'
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {userName}! 👋</h1>
        <p className="text-gray-500">Your centralized command center — keep track of your academics, wellbeing, and budget.</p>
      </div>

      {/* AI Status Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-3"><Sparkles className="w-6 h-6 text-purple-300"/>Overall Status</h2>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${integrationStats.burnoutRisk==='High'?'bg-red-500':integrationStats.burnoutRisk==='Moderate'?'bg-orange-400':'bg-teal-400'} text-white`}>
              Burnout Risk: {integrationStats.burnoutRisk}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Today's Mood", val: integrationStats.latestMood },
              { label: 'Stress Level', val: `${integrationStats.latestStressLevel}/10` },
              { label: 'Pending Tasks', val: integrationStats.pendingTasks },
              { label: 'Critical Tasks', val: integrationStats.criticalTasks },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                <p className="text-indigo-100 text-xs font-medium mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.val}</p>
              </div>
            ))}
          </div>
          <div className="bg-indigo-900/40 backdrop-blur-sm p-4 rounded-2xl border border-indigo-400/30 flex items-start gap-3">
            <BrainCircuit className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5"/>
            <p className="text-sm leading-relaxed text-indigo-50"><strong>AI Insight:</strong> {integrationStats.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Budget summary strip */}
      <div className="max-w-4xl">
        {/* Budget strip */}
        <div onClick={() => navigate('/budget')} className="group cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600"><TrendingDown className="w-5 h-5"/></div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Budget — This Month</p>
                <p className="text-xs text-gray-500">{budgetSummary?.count || 0} expenses recorded</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors"/>
          </div>
          {budgetSummary ? (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent: <strong className="text-gray-900">{fmt(budgetSummary.totalSpent)}</strong></span>
                <span className="text-gray-600">Budget: <strong className="text-gray-900">{budgetSummary.budget > 0 ? fmt(budgetSummary.budget) : 'Not set'}</strong></span>
              </div>
              {budgetSummary.budget > 0 && (
                <>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${budgetPct >= 100 ? 'bg-red-500' : budgetPct >= 80 ? 'bg-orange-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(budgetPct, 100)}%` }}/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{budgetPct}% used · {fmt(budgetSummary.remaining)} remaining</p>
                </>
              )}
            </div>
          ) : <p className="text-xs text-gray-400">Loading budget data...</p>}
        </div>

        </div>


      {/* Module Navigation Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map(mod => (
            <div key={mod.path} onClick={() => navigate(mod.path)}
              className={`group cursor-pointer bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md ${mod.hover} transition-all`}>
              <div className={`w-12 h-12 rounded-xl ${mod.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {mod.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{mod.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{mod.desc}</p>
              {mod.badge && (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${mod.badgeColor}`}>{mod.badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
