import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/budgetApi';

const CATEGORIES = ['Food', 'Transport', 'Books', 'Entertainment', 'Health', 'Clothing', 'Utilities', 'Education', 'Personal Care', 'Other'];

export function BudgetSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    monthlyBudget: 50000, warningThreshold: 80, strictMode: false,
    categoryBudgets: {}, muteAllAlerts: false, enableEmailAlerts: false
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await getSettings();
        setForm({
          monthlyBudget: s.monthlyBudget || 50000,
          warningThreshold: s.warningThreshold || 80,
          strictMode: s.strictMode || false,
          categoryBudgets: s.categoryBudgets || {},
          muteAllAlerts: s.muteAllAlerts || false,
          enableEmailAlerts: s.enableEmailAlerts || false
        });
      } catch (e) { setError(e.message); }
      setLoading(false);
    })();
  }, []);

  const setCatBudget = (cat, val) => {
    setForm(f => ({ ...f, categoryBudgets: { ...f.categoryBudgets, [cat]: val } }));
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await updateSettings(form);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Settings className="w-7 h-7 text-slate-600" /> Budget Settings
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        <div>
          <h2 className="font-bold text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Default Monthly Budget (LKR)</label>
              <input type="number" value={form.monthlyBudget} onChange={e => setForm(f => ({ ...f, monthlyBudget: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Warning Threshold (%)</label>
              <input type="number" min="1" max="100" value={form.warningThreshold} onChange={e => setForm(f => ({ ...f, warningThreshold: parseInt(e.target.value) || 80 }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              <p className="text-xs text-gray-400 mt-1">Alert when spending reaches this % of budget</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-bold text-gray-900 mb-4">Modes & Alerts</h2>
          <div className="space-y-3">
            {[
              { key: 'strictMode', label: 'Strict Mode', desc: 'Show prominent warnings when budget is exceeded' },
              { key: 'muteAllAlerts', label: 'Mute All Alerts', desc: 'Silence all budget notifications' },
              { key: 'enableEmailAlerts', label: 'Email Alerts', desc: 'Receive alert emails (requires email config)' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-sm text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form[key] ? 'bg-indigo-500' : 'bg-gray-300'}`}
                  onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-bold text-gray-900 mb-1">Category Micro-Budgets</h2>
          <p className="text-xs text-gray-500 mb-4">Set spending limits per category. Leave at 0 to disable.</p>
          <div className="space-y-3">
            {CATEGORIES.map(cat => (
              <div key={cat} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 w-32 shrink-0">{cat}</span>
                <input type="number" min="0" value={form.categoryBudgets[cat] || ''} onChange={e => setCatBudget(cat, parseFloat(e.target.value) || 0)}
                  placeholder="No limit" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
