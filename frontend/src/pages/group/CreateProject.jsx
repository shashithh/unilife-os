import React, { useState } from 'react';
import { ArrowLeft, Save, Sparkles, Calendar, Type, FileText, AlertTriangle } from 'lucide-react';

const authH = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

export function CreateProject({ setView }) {
  const [form, setForm] = useState({ name: '', description: '', deadline: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: authH(),
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to create project');
      setView('home');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => setView('home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </button>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Sparkles className="w-6 h-6" /></div>
        <h1 className="text-2xl font-bold text-slate-800">New AI-Powered Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        {error && <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {error}</div>}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Type className="w-3.5 h-3.5" /> Project Name</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            placeholder="e.g. Interaction Design 2024" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            placeholder="Describe the main goal of this collaboration..." />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Final Deadline</label>
            <input type="date" required value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-200 transition-all disabled:opacity-50">
          {loading ? 'Re-analyzing with AI...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
