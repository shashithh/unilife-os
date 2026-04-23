import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, RefreshCw } from 'lucide-react';
import { getExpenses, deleteExpense } from '../../services/budgetApi';

const fmt = (n) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

const CAT_COLORS = { Food: 'bg-teal-100 text-teal-700', Transport: 'bg-blue-100 text-blue-700', Books: 'bg-purple-100 text-purple-700', Entertainment: 'bg-pink-100 text-pink-700', Health: 'bg-green-100 text-green-700', Clothing: 'bg-orange-100 text-orange-700', Other: 'bg-gray-100 text-gray-700' };

export function ExpenseHistory() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterMonth, setFilterMonth] = useState(localStorage.getItem('budgetSelectedMonth') || new Date().toISOString().slice(0, 7));
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const data = await getExpenses(); setExpenses(data); }
    catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    setDeleting(id);
    try { await deleteExpense(id); setExpenses(p => p.filter(e => e._id !== id)); }
    catch (e) { alert(e.message); }
    setDeleting(null);
  };

  const filtered = expenses.filter(e => {
    const mMatch = new Date(e.date).toISOString().slice(0, 7) === filterMonth;
    const cMatch = filterCat === 'All' || e.category === filterCat;
    const sMatch = e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return mMatch && cMatch && sMatch;
  });

  const categories = ['All', ...new Set(expenses.map(e => e.category))];
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Expense History</h1>
        <button onClick={() => navigate('/budget/add')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium">
          + Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex justify-between items-center text-sm text-slate-600">
        <span>{filtered.length} expense{filtered.length !== 1 ? 's' : ''}</span>
        <span className="font-bold text-slate-800">Total: {fmt(total)}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          No expenses found for this filter.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          {filtered.map(e => (
            <div key={e._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CAT_COLORS[e.category] || CAT_COLORS.Other}`}>{e.category}</span>
                <div>
                  <p className="font-medium text-sm text-gray-900">{e.title}</p>
                  <p className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}{e.note && ` · ${e.note}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-sm text-gray-900">{fmt(e.amount)}</p>
                <button onClick={() => handleDelete(e._id)} disabled={deleting === e._id}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
