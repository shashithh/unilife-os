import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Clock, Mail, Sparkles, Users, BarChart2 } from 'lucide-react';

export function ProjectDashboard({ project, setView }) {
  const [milestones, setMilestones] = useState(project.milestones || []);

  const toggleMilestone = (idx) => {
    const newMs = [...milestones];
    newMs[idx].status = newMs[idx].status === 'done' ? 'pending' : 'done';
    setMilestones(newMs);
    // Note: In real app, would call API to save
  };

  const completed = milestones.filter(m => m.status === 'done').length;
  const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => setView('home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100"><Sparkles className="w-6 h-6" /></div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{project.name}</h1>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-2"><Clock className="w-4 h-4" /> Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-slate-600 bg-white/50 p-4 rounded-2xl border border-slate-100 max-w-2xl">{project.description}</p>
        </div>
        
        <div className="w-full md:w-64 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-800">Overall Progress</span>
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000`} style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {completed} of {milestones.length} milestones complete</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-500" /> Milestones</h2>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} onClick={() => toggleMilestone(i)}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${m.status === 'done' ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100 hove:border-indigo-200'}`}>
                <div className="flex items-center gap-4">
                  {m.status === 'done' ? <CheckCircle2 className="w-6 h-6 text-indigo-600 fill-indigo-50" /> : <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors" />}
                  <div>
                    <p className={`font-semibold ${m.status === 'done' ? 'text-indigo-900 line-through' : 'text-slate-700'}`}>{m.title}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Due by {new Date(m.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500" /> Team</h2>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
            {(project.members || []).map((m, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-700">{m.name?.[0] || 'U'}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{m.name || 'User'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{m.role || 'Member'}</p>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Mail className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
