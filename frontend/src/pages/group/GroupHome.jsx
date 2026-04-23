import React, { useState, useEffect } from 'react';
import { Users, Plus, Brain, ArrowRight, BarChart2 } from 'lucide-react';

const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

export function GroupHome({ setView, setActiveProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects', { headers: authH() })
      .then(r => r.json()).then(p => {
        setProjects(Array.isArray(p) ? p : []);
        setLoading(false);
      }).catch(e => {
        console.error('Fetch error:', e);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" /> Group Collaboration
          </h1>
          <p className="text-slate-500 mt-1">Combine your academic efforts with AI-powered collaboration.</p>
        </div>
        <button
          onClick={() => setView('create')}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Start New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <BarChart2 className="w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <Brain className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Projects Yet</h2>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create an AI-powered project to organize your team, milestones, and shared goals.</p>
          <button
            onClick={() => setView('create')}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Create your first project &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div
              key={p._id}
              onClick={() => { setActiveProject(p); setView('project'); }}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg"><Users className="w-5 h-5 text-indigo-600" /></div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{p.priority}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{p.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {(p.members || []).slice(0, 3).map((m, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{m.name?.[0] || 'U'}</div>
                  ))}
                  {(p.members?.length || 0) > 3 && <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">+{p.members.length - 3}</div>}
                </div>
                <div className="flex items-center gap-1 text-xs text-indigo-600 font-bold group-hover:gap-2 transition-all">Details <ArrowRight className="w-3.5 h-3.5" /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
