import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Wallet, TrendingDown, AlertTriangle, PieChart, ArrowRight, Sparkles, RefreshCw
} from 'lucide-react';
import {
  getDashboardData, getInsights, getSettings, getExpenses, getMonthlyBudgets
} from '../../services/budgetApi';

const fmt = (n) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

export function BudgetDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [insights, setInsights] = useState(null);
  const [settings, setSettings] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    localStorage.getItem('budgetSelectedMonth') || new Date().toISOString().slice(0, 7)
  );

  useEffect(() => { localStorage.setItem('budgetSelectedMonth', selectedMonth); }, [selectedMonth]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
        const [d, i, s, e, mb] = await Promise.all([getDashboardData(), getInsights(), getSettings(), getExpenses(), getMonthlyBudgets()]);
        setDashboard(d); setInsights(i); setSettings(s); setAllExpenses(e); setMonthlyBudgets(mb);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500">Loading budget data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Try Again</button>
      </div>
    </div>
  );

  const monthExp = allExpenses.filter(e => new Date(e.date).toISOString().slice(0, 7) === selectedMonth);
  const selBudget = monthlyBudgets.find(b => b.month === selectedMonth)?.monthlyBudget || 0;
  const totalSpent = monthExp.reduce((s, e) => s + e.amount, 0);
  const remaining = selBudget - totalSpent;
  const pct = selBudget > 0 ? Math.round((totalSpent / selBudget) * 100) : 0;
  const isWarning = settings && pct >= settings.warningThreshold;
  const isCritical = pct >= 100;

  const catMap = {};
  monthExp.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  const getMonthLabel = (yyyy_mm) => {
    const [y, m] = yyyy_mm.split('-');
    return new Date(y, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const catBudgets = settings?.categoryBudgets || {};
  const microBudgets = Object.keys(catBudgets).filter(k => catBudgets[k] > 0).map(cat => {
    const limit = parseInt(catBudgets[cat]);
    const spent = monthExp.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return { category: cat, spent, limit, usage: Math.min((spent / limit) * 100, 100) };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-600" /> Budget Manager
          </h1>
          <p className="text-slate-500 mt-1">Track your spending and manage finances smartly.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input type="month" value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <button onClick={() => navigate('/budget/insights')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <PieChart className="w-4 h-4" /> Insights
          </button>
          <button onClick={() => navigate('/budget/monthly-budget')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
            <Wallet className="w-4 h-4" /> Set Budget
          </button>
          <button onClick={() => navigate('/budget/add')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Sub Nav */}
      <div className="flex gap-1 border-b border-slate-200 pb-0">
        {[{label:'Dashboard',path:'/budget'},{label:'Add Expense',path:'/budget/add'},{label:'History',path:'/budget/history'},{label:'Insights',path:'/budget/insights'},{label:'Alerts',path:'/budget/alerts'},{label:'Settings',path:'/budget/settings'}].map(item => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${window.location.pathname === item.path ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {isWarning && !isCritical && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3 text-orange-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div><h4 className="font-bold">Budget Warning</h4><p className="text-sm mt-1">You've used {pct}% of your budget. Try to minimize non-essential expenses.</p></div>
        </div>
      )}
      {isCritical && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div><h4 className="font-bold">Budget Exceeded!</h4><p className="text-sm mt-1">You've exceeded your budget by {fmt(Math.abs(remaining))}.</p></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* No budget warning */}
          {selBudget === 0 && (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl"><AlertTriangle className="w-6 h-6 text-amber-600" /></div>
              <div>
                <h3 className="font-bold text-amber-900 mb-1">No Budget Set for {getMonthLabel(selectedMonth)}</h3>
                <p className="text-amber-700 text-sm mb-3">Set a budget to track and get insights.</p>
                <button onClick={() => navigate('/budget/monthly-budget')} className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700">Set Monthly Budget</button>
              </div>
            </div>
          )}

          {/* Main balance card */}
          <div className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-slate-400 font-medium mb-1">Balance for {getMonthLabel(selectedMonth)}</p>
                  <h2 className={`text-4xl font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>
                    {selBudget > 0 ? fmt(remaining) : fmt(totalSpent)}
                  </h2>
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm"><Wallet className="w-6 h-6 text-indigo-300" /></div>
              </div>
              {selBudget > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-300">Spent: {fmt(totalSpent)}</span>
                    <span className="text-slate-300">Budget: {fmt(selBudget)}</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-indigo-400'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{pct}% Used</span>
                    <span>{remaining >= 0 ? `${fmt(remaining)} remaining` : `${fmt(Math.abs(remaining))} over budget`}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center">Set a monthly budget to see progress tracking</p>
              )}
            </div>
          </div>

          {/* Insights row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border-l-4 border-l-purple-500 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-purple-500" /><h3 className="font-bold text-gray-900">Spending Prediction</h3></div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{fmt(insights?.predictedMonthlySpend || 0)}</p>
              <p className="text-sm text-gray-600 mb-3">Estimated total by month end</p>
              {insights && insights.predictedMonthlySpend > (settings?.monthlyBudget || 0)
                ? <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded-lg">At this rate, you may exceed your budget.</p>
                : <p className="text-xs font-medium text-green-600 bg-green-50 p-2 rounded-lg">You are on track to stay within budget.</p>
              }
            </div>
            <div className="p-5 border-l-4 border-l-orange-500 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3"><TrendingDown className="w-4 h-4 text-orange-500" /><h3 className="font-bold text-gray-900">Top Category</h3></div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{topCat[0]}</p>
              <p className="text-sm text-gray-600 mb-3">{fmt(topCat[1])} spent in this category</p>
              <p className="text-xs font-medium text-orange-700 bg-orange-50 p-2 rounded-lg">Try reducing {topCat[0]} expenses to save more.</p>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Micro budgets */}
          {microBudgets.length > 0 && (
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Micro-Budgets</h2>
                <button onClick={() => navigate('/budget/settings')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Manage</button>
              </div>
              <div className="space-y-4">
                {microBudgets.slice(0, 3).map(b => (
                  <div key={b.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{b.category}</span>
                      <span className={`font-semibold ${b.spent > b.limit ? 'text-red-600' : 'text-gray-900'}`}>{fmt(b.spent)} / {fmt(b.limit)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${b.spent > b.limit ? 'bg-red-500' : b.usage > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                        style={{ width: `${b.usage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly budgets */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Monthly Budgets</h2>
              <button onClick={() => navigate('/budget/monthly-budget')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Manage</button>
            </div>
            <div className="space-y-2">
              {monthlyBudgets.slice(0, 4).map(b => (
                <div key={b.month} className={`flex justify-between items-center p-3 rounded-xl border ${b.month === selectedMonth ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div>
                    <p className={`font-medium text-sm ${b.month === selectedMonth ? 'text-indigo-900' : 'text-gray-900'}`}>{b.month}</p>
                    {b.month === selectedMonth && <p className="text-xs text-indigo-600">Selected</p>}
                  </div>
                  <p className={`font-semibold text-sm ${b.month === selectedMonth ? 'text-indigo-900' : 'text-gray-900'}`}>{fmt(b.monthlyBudget)}</p>
                </div>
              ))}
              {monthlyBudgets.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No monthly budgets set yet.</p>}
            </div>
          </div>

          {/* Recent expenses */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Expenses</h2>
              <button onClick={() => navigate('/budget/history')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
            </div>
            <div className="space-y-2">
              {monthExp.slice(0, 5).map(e => (
                <div key={e._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-500">{e.category} · {new Date(e.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-sm text-gray-900">{fmt(e.amount)}</p>
                </div>
              ))}
              {monthExp.length === 0 && <p className="text-gray-500 text-sm text-center py-3">No expenses this month.</p>}
            </div>
            <button onClick={() => navigate('/budget/history')}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              See Full History <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
