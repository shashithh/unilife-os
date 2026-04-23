import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingDown, TrendingUp, PieChart, RefreshCw } from 'lucide-react';
import { getInsights, getExpenses } from '../../services/budgetApi';

const fmt = (n) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

const COLORS = ['#14b8a6','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#10b981','#f97316','#ec4899','#6366f1','#64748b'];

export function BudgetInsights() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filterMonth, setFilterMonth] = useState(localStorage.getItem('budgetSelectedMonth') || new Date().toISOString().slice(0, 7));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [i, e] = await Promise.all([getInsights(), getExpenses()]);
        setInsights(i); setExpenses(e);
      } catch (err) { console.error(err); }
      setLoading(false);
    })();
  }, []);

  const monthExp = expenses.filter(e => new Date(e.date).toISOString().slice(0, 7) === filterMonth);
  const catMap = {};
  monthExp.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
  const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const total = catEntries.reduce((s, [, v]) => s + v, 0);

  const daily = {};
  monthExp.forEach(e => {
    const d = new Date(e.date).toLocaleDateString('en-CA');
    daily[d] = (daily[d] || 0) + e.amount;
  });
  const dailyEntries = Object.entries(daily).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <PieChart className="w-7 h-7 text-purple-600" /> Budget Insights
        </h1>
        <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
      </div>

      {/* Sub Nav */}
      <div className="flex gap-1 border-b border-slate-200">
        {[{label:'Dashboard',path:'/budget'},{label:'Add Expense',path:'/budget/add'},{label:'History',path:'/budget/history'},{label:'Insights',path:'/budget/insights'},{label:'Alerts',path:'/budget/alerts'},{label:'Settings',path:'/budget/settings'}].map(item => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${window.location.pathname === item.path ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-purple-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-5 h-5 text-indigo-500" /><p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Total Spent</p></div>
              <p className="text-2xl font-bold text-gray-900">{fmt(insights?.totalSpent || 0)}</p>
              <p className="text-xs text-gray-500 mt-1">All expenses total</p>
            </div>
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-purple-500" /><p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Predicted</p></div>
              <p className="text-2xl font-bold text-gray-900">{fmt(insights?.predictedMonthlySpend || 0)}</p>
              <p className="text-xs text-gray-500 mt-1">By end of month</p>
            </div>
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 col-span-2">
              <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-orange-500" /><p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Top Category</p></div>
              <p className="text-xl font-bold text-gray-900">{insights?.topCategory || 'None'}</p>
              <p className="text-sm text-gray-600">{fmt(insights?.topAmount || 0)} spent</p>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-bold text-gray-900 mb-4">Category Breakdown</h2>
            {catEntries.length === 0
              ? <p className="text-sm text-gray-400 text-center py-6">No expenses this month.</p>
              : catEntries.map(([cat, amt], i) => (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat}</span>
                    <span className="text-gray-900 font-semibold">{fmt(amt)} <span className="text-gray-400 text-xs">({total > 0 ? Math.round((amt/total)*100) : 0}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${total > 0 ? (amt/total)*100 : 0}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))
            }
          </div>

          {/* Daily spending */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <h2 className="font-bold text-gray-900 mb-4">Daily Spending — {filterMonth}</h2>
            {dailyEntries.length === 0
              ? <p className="text-sm text-gray-400 text-center py-6">No expenses for this month.</p>
              : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {dailyEntries.map(([date, amt]) => (
                    <div key={date} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 shrink-0">{new Date(date).toLocaleDateString('default', {weekday:'short', day:'numeric', month:'short'})}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((amt / (Math.max(...dailyEntries.map(d => d[1]))))*100, 100)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-800 w-24 text-right shrink-0">{fmt(amt)}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
