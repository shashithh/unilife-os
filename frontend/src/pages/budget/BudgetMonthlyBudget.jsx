import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { getMonthlyBudgets, setMonthlyBudget, deleteMonthlyBudget } from '../../services/budgetApi';

const fmt = (n) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

export function BudgetMonthlyBudget() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ month: new Date().toISOString().slice(0, 7), amount: '' });

  const load = async () => {
    setLoading(true);
    try { const data = await getMonthlyBudgets(); setBudgets(data); }
    catch (e) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSet = async (e) => {
    e.preventDefault();
    if (!form.month || !form.amount) { setError('Month and amount are required'); return; }
    setSaving(true); setError('');
    try {
      await setMonthlyBudget(form.month, parseFloat(form.amount));
      setSaved(true); await load(); setForm(f => ({ ...f, amount: '' }));
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const handleDelete = async (month) => {
    if (!confirm(`Delete budget for ${month}?`)) return;
    try { await deleteMonthlyBudget(month); setBudgets(p => p.filter(b => b.month !== month)); }
    catch (e) { setError(e.message); }
  };

  const getMonthLabel = (yyyy_mm) => {
    const [y, m] = yyyy_mm.split('-');
    return new Date(y, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <CalendarDays className="w-7 h-7 text-indigo-600" /> Monthly Budgets
      </h1>

      {/* Sub Nav */}
      <div className="flex gap-1 border-b border-slate-200">
        {[{label:'Dashboard',path:'/budget'},{label:'Add Expense',path:'/budget/add'},{label:'History',path:'/budget/history'},{label:'Insights',path:'/budget/insights'},{label:'Alerts',path:'/budget/alerts'},{label:'Settings',path:'/budget/settings'}].map(item => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${window.location.pathname === item.path ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      {/* Set budget form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-500" /> Set Budget for a Month</h2>
        <form onSubmit={handleSet} className="flex flex-col sm:flex-row gap-3">
          <input type="month" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <input type="number" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            placeholder="Budget amount (LKR)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <button type="submit" disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 shrink-0">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Set Budget'}
          </button>
        </form>
      </div>

      {/* Budget list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
        {loading ? (
          <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" /></div>
        ) : budgets.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No monthly budgets set yet.</p>
          </div>
        ) : budgets.map(b => {
          const isCurrentMonth = b.month === new Date().toISOString().slice(0, 7);
          return (
            <div key={b.month} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                {isCurrentMonth && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">Current</span>}
                <div>
                  <p className="font-semibold text-gray-900">{getMonthLabel(b.month)}</p>
                  <p className="text-xs text-gray-500">{b.month}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-gray-900">{fmt(b.monthlyBudget)}</p>
                <button onClick={() => handleDelete(b.month)} className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
