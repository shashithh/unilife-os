import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Users, BookOpen, Sparkles, ArrowRight,
  Plus, Target, Flame, CheckCircle2, Clock, AlertCircle,
  ChevronLeft, Search, Bell, ChevronRight, Menu, UserPlus,
  CalendarDays, User, Settings, BarChart2, ListTodo,
  Milestone, CalendarCheck, RefreshCw, HeartPulse, Wallet, X,
  Eye, EyeOff, LogOut
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

const API = '/api';

// ─── UI primitives ────────────────────────────────────────────
function Card({ children, className = '', hover = false }) {
  return (
    <div className={`rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-lg overflow-hidden
      ${hover ? 'transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
}

function Btn({ children, variant = 'primary', size = 'md', icon, onClick, disabled, className = '', type = 'button' }) {
  const v = {
    primary:   'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    danger:    'bg-red-50 text-red-600 hover:bg-red-100',
    ghost:     'bg-transparent text-gray-600 hover:bg-gray-100',
    glass:     'bg-white/50 backdrop-blur-sm text-gray-800 border border-white/50 hover:bg-white/80',
  };
  const s = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed gap-2 ${v[variant]} ${s[size]} ${className}`}>
      {icon}{children}
    </button>
  );
}

function Badge({ children, variant = 'gray' }) {
  const v = {
    blue:   'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    teal:   'bg-teal-100 text-teal-700 border-teal-200',
    green:  'bg-green-100 text-green-700 border-green-200',
    red:    'bg-red-100 text-red-700 border-red-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    gray:   'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${v[variant]}`}>
      {children}
    </span>
  );
}

function Spinner({ text = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      {text}
    </div>
  );
}

function avatarColor(name = '') {
  const colors = ['bg-blue-400', 'bg-purple-400', 'bg-teal-400', 'bg-orange-400', 'bg-pink-400'];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
}

function Avatar({ name = '?', size = 'md' }) {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';
  return (
    <div className={`${s} ${avatarColor(name)} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
      {name[0]?.toUpperCase()}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────
const MODULE_NAV = [
  { id: 'landing',   icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { id: 'landing',   icon: <BookOpen size={18} />,        label: 'Academic Planner' },
  { id: 'create',    icon: <Users size={18} />,           label: 'Group Collaboration' },
  { id: 'landing',   icon: <HeartPulse size={18} />,      label: 'Wellbeing Hub' },
  { id: 'landing',   icon: <Wallet size={18} />,          label: 'Budget Manager' },
];
const SYSTEM_NAV = [
  { id: 'landing',  icon: <CalendarDays size={18} />, label: 'Calendar' },
  { id: 'landing',  icon: <Bell size={18} />,         label: 'Notifications' },
  { id: 'profile',  icon: <User size={18} />,         label: 'Profile' },
  { id: 'settings', icon: <Settings size={18} />,     label: 'Settings' },
];

function Sidebar({ view, setView, sidebarOpen, setSidebarOpen, user, logout }) {
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20
        transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              UniLife OS
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Modules */}
        <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Modules</div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {MODULE_NAV.map(item => (
            <button key={item.label} onClick={() => { setView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${view === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <span className={view === item.id ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="mt-6 mb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
          {SYSTEM_NAV.map(item => (
            <button key={item.label} onClick={() => { setView(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150">
              <span className="text-gray-400">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || '?'} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.major || user?.email || ''}</p>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Top Navbar ───────────────────────────────────────────────
function Navbar({ view, setSidebarOpen, user, logout }) {
  const crumbs = {
    landing:   'Dashboard',
    create:    'Group Collaboration',
    dashboard: 'Project Dashboard',
    tasks:     'My Tasks',
    meeting:   'Meeting Scheduler',
    profile:   'Profile',
    settings:  'Settings',
  };
  return (
    <header className="h-16 bg-white/60 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center text-sm font-medium text-gray-500">
          <span>UniLife OS</span>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-900">{crumbs[view] || 'Dashboard'}</span>
        </div>
      </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium hidden sm:block">{user?.name}</span>
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md hover:scale-105 transition-all duration-200">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
    </header>
  );
}

// ════════════════════════════════════════════════════════════
//  LANDING (Dashboard home)
// ════════════════════════════════════════════════════════════
function Landing({ setView }) {
  const modules = [
    { icon: <LayoutDashboard className="w-7 h-7" />, label: 'Dashboard',           desc: 'Overview of your projects, milestones, and AI insights at a glance.',  view: 'landing',   gradient: 'from-blue-500 to-indigo-600',  bg: 'from-blue-50 to-indigo-50',   border: 'border-blue-100'   },
    { icon: <Users className="w-7 h-7" />,           label: 'Group Collaboration', desc: 'Create AI-powered projects, assign roles, and generate milestones.',    view: 'create',    gradient: 'from-teal-500 to-cyan-600',    bg: 'from-teal-50 to-cyan-50',     border: 'border-teal-100'   },
    { icon: <BarChart2 className="w-7 h-7" />,       label: 'Project Dashboard',   desc: 'Monitor project health, workload distribution, and AI re-analysis.',   view: 'dashboard', gradient: 'from-violet-500 to-purple-600',bg: 'from-violet-50 to-purple-50', border: 'border-violet-100' },
    { icon: <ListTodo className="w-7 h-7" />,        label: 'My Tasks',            desc: 'AI-generated personal to-do list linked to your assigned functions.',   view: 'tasks',     gradient: 'from-pink-500 to-rose-500',    bg: 'from-pink-50 to-rose-50',     border: 'border-pink-100'   },
    { icon: <CalendarCheck className="w-7 h-7" />,   label: 'Meeting Scheduler',   desc: 'Generate focused AI meeting agendas based on current project state.',   view: 'meeting',   gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50',  border: 'border-amber-100'  },
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 md:p-16 text-white shadow-2xl shadow-blue-500/30">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/80 font-semibold text-lg tracking-wide">UniLife OS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Your all-in-one<br />student operating system.
          </h1>
          <p className="text-white/75 text-lg mb-8 leading-relaxed">
            Collaborate with peers, manage projects with AI, and stay on top of your team's progress — all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn variant="glass" size="lg" icon={<Plus className="w-5 h-5" />} onClick={() => setView('create')}>
              New Project
            </Btn>
            <button onClick={() => setView('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold text-base hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-md">
              <BarChart2 className="w-5 h-5" /> View Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Modules</h2>
          <p className="text-gray-500 mt-1">Everything you need to manage group projects.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map(mod => (
            <button key={mod.label} onClick={() => setView(mod.view)}
              className={`group relative text-left rounded-2xl border ${mod.border} bg-gradient-to-br ${mod.bg} p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.gradient} text-white flex items-center justify-center mb-4 shadow-md`}>
                {mod.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{mod.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{mod.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                Open <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* System */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">System</h2>
          <p className="text-gray-500 mt-1">Manage your account and app settings.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {[
            { icon: <User className="w-5 h-5" />,     label: 'Profile',  desc: 'Manage your account and preferences.',  color: 'text-purple-600', bg: 'bg-purple-100', view: 'profile'  },
            { icon: <Settings className="w-5 h-5" />, label: 'Settings', desc: 'Customize your UniLife OS experience.', color: 'text-gray-600',   bg: 'bg-gray-100',   view: 'settings' },
          ].map(item => (
            <button key={item.label} onClick={() => setView(item.view)}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left">
              <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-400 truncate">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  CREATE PROJECT
// ════════════════════════════════════════════════════════════
function CreateProject({ setView, setProject }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', deadline: '' });
  const [validation, setValidation] = useState(null);
  // Dynamic member lookup state
  const [idInput, setIdInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [members, setMembers] = useState([]); // [{ id, name, email, major }]
  const [assigned, setAssigned] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const f = (k, v) => setForm(x => ({ ...x, [k]: v }));
  const inp = (err) => `w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all ${err ? 'border-red-400' : 'border-gray-200'}`;

  async function lookupUser() {
    const id = idInput.trim();
    if (!id) return;
    if (members.find(m => m.id === id)) { setLookupError('User already added'); return; }
    setLookupLoading(true); setLookupError('');
    try {
      const { data } = await axios.get(`${API}/users/lookup/${id}`);
      setMembers(prev => [...prev, { id: String(data.id), name: data.name, email: data.email, major: data.major }]);
      setIdInput('');
    } catch (e) { setLookupError(e.response?.data?.error || 'User not found'); }
    setLookupLoading(false);
  }
  function removeMember(id) { setMembers(prev => prev.filter(m => m.id !== id)); }

  async function step1() {
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ai/validate`, { name: form.name, description: form.description, deadline: form.deadline, memberCount: Math.max(members.length, 1) });
      if (!data.valid) { setError(data.reason); setLoading(false); return; }
      setValidation(data); setStep(2);
    } catch (err) { 
      setError(err.response?.data?.error || 'Backend unreachable — is the server running?'); 
    }
    setLoading(false);
  }
  async function step2() {
    if (members.length === 0) { setError('Add at least one team member'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ai/suggest-functions`, { name: form.name, description: form.description, deadline: form.deadline, detectedType: validation.detectedType, memberCount: members.length, members });
      setAssigned((data.functions || []).map(fn => {
        const match = members.find(m => m.name === fn.suggestedRole) || members[0];
        return { ...fn, assignedTo: match.name, assignedUserId: fn.assignedUserId || match.id };
      }));
      setStep(3);
    } catch (err) { 
      setError(err.response?.data?.error || 'Failed to suggest functions'); 
    }
    setLoading(false);
  }
  async function step3() {
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ai/milestones`, { name: form.name, description: form.description, detectedType: validation.detectedType, deadline: form.deadline, assignedFunctions: assigned });
      setMilestones(data.milestones || []); setStep(4);
    } catch (err) { 
      setError(err.response?.data?.error || 'Failed to generate milestones'); 
    }
    setLoading(false);
  }
  async function step4() {
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ai/dashboard`, { name: form.name, description: form.description, detectedType: validation.detectedType, deadline: form.deadline, members, assignedFunctions: assigned, milestones });
      setDashboard(data); setStep(5);
    } catch (err) { 
      setError(err.response?.data?.error || 'Failed to seed dashboard'); 
    }
    setLoading(false);
  }
  function finish() {
    const projectData = { name: form.name, description: form.description, deadline: form.deadline, detectedType: validation?.detectedType, members, functions: assigned, milestones, dashboard };
    axios.post(`${API}/projects`, projectData).catch(() => {});
    setProject(projectData); setView('dashboard');
  }

  const steps = ['Details', 'Members', 'Roles', 'Milestones', 'Launch'];
  const eBadge = e => e === 'High' ? 'red' : e === 'Medium' ? 'yellow' : 'green';

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Sparkles className="w-7 h-7 text-blue-600" /> New Project</h1>
        <p className="text-gray-500 text-sm mt-1">AI-powered setup in 5 steps.</p>
      </div>
      <div className="flex">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 text-center">
            <div className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${step===i+1?'border-blue-600 text-blue-700':step>i+1?'border-green-500 text-green-600':'border-gray-200 text-gray-400'}`}>
              {step > i+1 ? '✓ ' : `${i+1}. `}{s}
            </div>
          </div>
        ))}
      </div>
      <div className="h-1 bg-gray-100 rounded-full"><div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${(step/5)*100}%` }} /></div>

      <Card className="p-8">
        {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

        {/* STEP 1 — Project Details (no memberCount input) */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Project Name</label><input className={inp()} value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Student Budget Tracker App" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label><textarea className={`${inp()} resize-none h-20`} value={form.description} onChange={e => f('description', e.target.value)} placeholder="Describe the goal and outcome..." /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Deadline</label><input type="date" className={inp()} value={form.deadline} onChange={e => f('deadline', e.target.value)} /></div>
            <div className="flex justify-end pt-2 border-t border-gray-100">{loading ? <Spinner text="Validating..." /> : <Btn variant="primary" icon={<Sparkles className="w-4 h-4" />} onClick={step1}>Validate with AI</Btn>}</div>
          </div>
        )}

        {/* STEP 2 — Dynamic User ID Lookup */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Team Members</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="blue">{validation?.detectedType}</Badge>
                <span className="text-xs text-gray-400">Team size: <span className="font-semibold text-gray-700">{members.length}</span> (derived from added members)</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Enter User ID</label>
              <div className="flex gap-2">
                <input
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono ${lookupError ? 'border-red-400' : 'border-gray-200'}`}
                  value={idInput} onChange={e => { setIdInput(e.target.value); setLookupError(''); }}
                  onKeyDown={e => e.key === 'Enter' && lookupUser()}
                  placeholder="e.g. 6650f3a2c1b4e2001f3d9abc"
                />
                <Btn variant="secondary" onClick={lookupUser} disabled={lookupLoading || !idInput.trim()}
                  icon={lookupLoading ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}>
                  {lookupLoading ? '' : 'Add'}
                </Btn>
              </div>
              {lookupError && <p className="text-xs text-red-500 mt-1">{lookupError}</p>}
              <p className="text-xs text-gray-400 mt-1">Press Enter or click Add. The user must be registered in the system.</p>
            </div>
            {members.length > 0 ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Added Members ({members.length})</label>
                {members.map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Avatar name={m.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate font-mono">{m.id}</p>
                    </div>
                    {m.major && <Badge variant="purple">{m.major}</Badge>}
                    <button onClick={() => removeMember(m.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1"><X size={16} /></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">No members added yet. Enter a User ID above.</div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <Btn variant="ghost" icon={<ChevronLeft className="w-4 h-4" />} onClick={() => setStep(1)}>Back</Btn>
              {loading ? <Spinner text="Suggesting functions..." /> : <Btn variant="primary" icon={<Sparkles className="w-4 h-4" />} onClick={step2} disabled={members.length === 0}>Suggest Functions</Btn>}
            </div>
          </div>
        )}

        {/* STEP 3 — Assign Roles (select by user ID) */}
        {step === 3 && (
          <div className="space-y-5">
            <div><h2 className="text-xl font-bold text-gray-900">Assign Roles</h2><p className="text-sm text-gray-500 mt-1">AI suggested {assigned.length} functions. Reassign as needed.</p></div>
            <div className="space-y-3">
              {assigned.map((fn, i) => (
                <div key={fn.id} className="rounded-xl border border-gray-200 p-4 bg-gray-50/50">
                  <div className="flex items-start justify-between mb-3">
                    <div><span className="text-xs font-mono text-blue-600 font-semibold">{fn.id}</span><p className="font-semibold text-gray-900 mt-0.5">{fn.name}</p><p className="text-xs text-gray-500 mt-0.5">{fn.description}</p></div>
                    <Badge variant={eBadge(fn.estimatedEffort)}>{fn.estimatedEffort}</Badge>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assigned To</label>
                    <select className={inp()} value={fn.assignedUserId}
                      onChange={e => { const picked = members.find(m => m.id === e.target.value); setAssigned(a => a.map((x,j) => j===i ? {...x, assignedTo: picked?.name||x.assignedTo, assignedUserId: e.target.value} : x)); }}>
                      {members.map(m => <option key={m.id} value={m.id}>{m.name} — …{m.id.slice(-6)}</option>)}
                    </select>
                    <p className="text-xs text-gray-400 mt-1 font-mono">User ID: {fn.assignedUserId}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <Btn variant="ghost" icon={<ChevronLeft className="w-4 h-4" />} onClick={() => setStep(2)}>Back</Btn>
              {loading ? <Spinner text="Generating milestones..." /> : <Btn variant="primary" icon={<Sparkles className="w-4 h-4" />} onClick={step3}>Generate Milestones</Btn>}
            </div>
          </div>
        )}

        {/* STEP 4 — Milestones */}
        {step === 4 && (
          <div className="space-y-5">
            <div><h2 className="text-xl font-bold text-gray-900">Milestone Schedule</h2><p className="text-sm text-gray-500 mt-1">{milestones.length} milestones · deadline {form.deadline}</p></div>
            <div className="space-y-3">{milestones.map(ms => (<div key={ms.id} className={`rounded-xl border p-4 ${ms.isCritical?'border-red-200 bg-red-50/40':'border-gray-200 bg-gray-50/50'}`}><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 mb-1"><span className="font-semibold text-gray-900">{ms.title}</span>{ms.isCritical&&<Badge variant="red">Critical</Badge>}</div><p className="text-xs text-gray-500">{ms.description}</p></div><span className="text-xs text-gray-400 font-mono shrink-0 ml-3">{ms.date}</span></div></div>))}</div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <Btn variant="ghost" icon={<ChevronLeft className="w-4 h-4" />} onClick={() => setStep(3)}>Back</Btn>
              {loading ? <Spinner text="Seeding dashboard..." /> : <Btn variant="primary" icon={<Sparkles className="w-4 h-4" />} onClick={step4}>Initialize Dashboard</Btn>}
            </div>
          </div>
        )}

        {/* STEP 5 — Launch */}
        {step === 5 && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg"><CheckCircle2 className="w-8 h-8 text-white" /></div>
            <div><h2 className="text-xl font-bold text-gray-900">Project Initialized!</h2><p className="text-sm text-gray-500 mt-1">{milestones.length} milestones · {assigned.length} functions · {members.length} members</p></div>
            <div className="flex justify-center gap-2 flex-wrap">
              {members.map(m => (<div key={m.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200"><Avatar name={m.name} size="sm" /><span className="text-xs font-medium text-gray-700">{m.name}</span></div>))}
            </div>
            {dashboard?.aiInsight && (<div className="text-left rounded-xl border border-blue-200 bg-blue-50 p-4"><div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-blue-600" /><span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">AI Insight</span></div><p className="text-sm text-blue-800 leading-relaxed">{dashboard.aiInsight}</p></div>)}
            <Btn variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={finish}>Open Dashboard</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  EXECUTION DASHBOARD
// ════════════════════════════════════════════════════════════
function ProjectDashboard({ project, setView }) {
  const [tab, setTab] = useState('overview');
  const [milestones, setMilestones] = useState(() =>
    (project?.milestones || []).map(m => ({ ...m, status: m.status || 'pending', notes: [] }))
  );
  const [noteInput, setNoteInput] = useState({});
  const [reassignTarget, setReassignTarget] = useState(null);
  const [newUserId, setNewUserId] = useState('');
  const [reassignLoading, setReassignLoading] = useState(false);
  const [reassignMsg, setReassignMsg] = useState('');
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [aiGoal, setAiGoal] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [search, setSearch] = useState('');

  if (!project) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><BarChart2 className="w-8 h-8 text-gray-400" /></div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">No active project</h2>
      <p className="text-gray-400 text-sm mb-4">Create a project first to enter execution mode.</p>
      <Btn variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setView('newproject')}>New Project</Btn>
    </div>
  );

  function toggleMilestone(id) {
    const next = (s) => s==='done'?'pending':s==='pending'?'in_progress':'done';
    setMilestones(ms => ms.map(m => m.id===id ? {...m, status: next(m.status)} : m));
    // persist to DB
    if (project._id) {
      const newStatus = next(milestones.find(m=>m.id===id)?.status || 'pending');
      axios.patch(`${API}/projects/${project._id}/milestones/${id}`, { status: newStatus }).catch(()=>{});
    }
  }
  function addNote(id) {
    const text = noteInput[id]?.trim();
    if (!text) return;
    const note = { text, author: 'You', time: 'just now' };
    setMilestones(ms => ms.map(m => m.id===id ? {...m, notes:[...(m.notes||[]), note]} : m));
    setNoteInput(n => ({...n, [id]: ''}));
    // persist to DB
    if (project._id) {
      axios.patch(`${API}/projects/${project._id}/milestones/${id}`, { note }).catch(()=>{});
    }
  }
  async function syncProject() { setSyncing(true);setSyncMsg(''); try{const{data}=await axios.get(`${API}/projects`);setSyncMsg(`Synced — ${data.length} project(s) in database`);}catch{setSyncMsg('Sync failed — check connection');} setSyncing(false); }
  async function reAnalyze() { setHealthLoading(true); try{ const mp=project.members.map(m=>{const fns=project.functions.filter(f=>f.assignedTo===m.name);const done=milestones.filter(ms=>ms.status==='done'&&ms.linkedFunctions?.some(fid=>fns.find(f=>f.id===fid))).length;return{name:m.name,done,inProgress:0,skipped:0,total:fns.length};}); const{data}=await axios.post(`${API}/ai/reanalyze`,{projectName:project.name,deadline:project.deadline,milestones:project.milestones,memberProgress:mp}); setHealth(data); }catch{} setHealthLoading(false); }
  async function reassignMember() { if(!newUserId.trim()) return; setReassignLoading(true);setReassignMsg(''); try{const{data}=await axios.get(`${API}/users/lookup/${newUserId.trim()}`);setReassignMsg(`✓ Reassigned to ${data.name}`);setReassignTarget(null);setNewUserId('');}catch(e){setReassignMsg('✗ '+(e.response?.data?.error||'User not found'));} setReassignLoading(false); }
  async function runAiOptimization() { if(!aiGoal.trim()) return; setAiLoading(true); try{const{data}=await axios.post(`${API}/ai/reanalyze`,{projectName:project.name,deadline:project.deadline,milestones:project.milestones,memberProgress:project.members.map(m=>({name:m.name,done:0,inProgress:0,skipped:0,total:project.functions.filter(f=>f.assignedTo===m.name).length}))});setAiResult({goal:aiGoal,...data});}catch{setAiResult({goal:aiGoal,updatedInsight:'AI unavailable — try again shortly.',suggestion:'',risks:[]});} setAiLoading(false); }

  const filteredMembers = project.members.filter(m=>m.name.toLowerCase().includes(search.toLowerCase())||m.id?.toLowerCase().includes(search.toLowerCase()));
  const msStatusColor = s=>s==='done'?'text-green-600':s==='in_progress'?'text-amber-600':'text-gray-400';
  const msStatusIcon  = s=>s==='done'?'✓':s==='in_progress'?'◎':'○';
  const msStatusBadge = s=>s==='done'?'green':s==='in_progress'?'yellow':'gray';
  const hColor = health?(health.healthLabel==='On Track'?'#22c55e':health.healthLabel==='At Risk'?'#f59e0b':'#ef4444'):'#6366f1';
  const TABS=[{id:'overview',label:'Overview'},{id:'milestones',label:'Milestones & Tasks'},{id:'team',label:'Team'},{id:'ai',label:'✦ AI Tools'}];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Badge variant="blue">{project.detectedType}</Badge><Badge variant="gray">Execution Mode</Badge></div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Deadline: {project.deadline} · {project.members.length} members · {milestones.length} milestones</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="sm" icon={<RefreshCw className={`w-4 h-4 ${syncing?'animate-spin':''}`} />} onClick={syncProject} disabled={syncing}>{syncing?'Syncing...':'Sync'}</Btn>
          <Btn variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />} onClick={()=>setTab('ai')}>AI Optimize</Btn>
        </div>
      </div>
      {syncMsg&&<div className={`text-sm px-4 py-2 rounded-xl border ${syncMsg.startsWith('Synced')?'bg-green-50 border-green-200 text-green-700':'bg-red-50 border-red-200 text-red-700'}`}>{syncMsg}</div>}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${tab===t.id?'border-blue-600 text-blue-700':'border-transparent text-gray-500 hover:text-gray-800'}`}>{t.label}</button>)}
      </div>

      {tab==='overview'&&(
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[{label:'Members',val:project.members.length,color:'from-blue-500 to-indigo-600',icon:<Users className="w-5 h-5"/>},{label:'Functions',val:project.functions.length,color:'from-violet-500 to-purple-600',icon:<Target className="w-5 h-5"/>},{label:'Milestones',val:milestones.length,color:'from-teal-500 to-cyan-600',icon:<Milestone className="w-5 h-5"/>},{label:'Completed',val:milestones.filter(m=>m.status==='done').length,color:'from-green-500 to-emerald-600',icon:<CheckCircle2 className="w-5 h-5"/>}].map(s=>(
              <Card key={s.label} className="p-5"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`}>{s.icon}</div><div className="text-2xl font-extrabold text-gray-900">{s.val}</div><div className="text-xs text-gray-500 mt-0.5">{s.label}</div></Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500"/>Project Health</h3><button onClick={reAnalyze} disabled={healthLoading} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><RefreshCw className={`w-4 h-4 ${healthLoading?'animate-spin':''}`}/></button></div>
              {health?(<><div className="flex items-center gap-2 mb-3"><Badge variant={health.healthLabel==='On Track'?'green':health.healthLabel==='At Risk'?'yellow':'red'}>{health.healthLabel}</Badge><span className="text-2xl font-extrabold" style={{color:hColor}}>{health.overallHealthScore}</span></div><div className="h-2 bg-gray-100 rounded-full mb-4"><div className="h-2 rounded-full transition-all duration-700" style={{width:`${health.overallHealthScore}%`,background:hColor}}/></div><p className="text-sm text-gray-700 leading-relaxed mb-3">{health.updatedInsight}</p>{health.risks?.map((r,i)=><div key={i} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>{r}</div>)}{health.suggestion&&<div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800"><span className="font-semibold">Suggestion: </span>{health.suggestion}</div>}</>):<div className="text-center py-8 text-gray-400 text-sm">Click ↻ to run AI health analysis.</div>}
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500"/>AI Insight</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{project.dashboard?.aiInsight||'Run AI Optimize to get insights.'}</p>
              {project.dashboard?.projectFlow?.stages&&<div className="space-y-2">{project.dashboard.projectFlow.stages.map((s,i)=><div key={i} className="flex items-center justify-between"><span className="text-sm text-gray-700">{s.stage}</span><Badge variant={s.status==='Completed'?'green':s.status==='In Progress'?'yellow':'gray'}>{s.status}</Badge></div>)}</div>}
            </Card>
          </div>
        </div>
      )}

      {tab==='milestones'&&(
        <div className="space-y-4">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500">{milestones.filter(m=>m.status==='done').length} / {milestones.length} completed</p><div className="w-48 h-2 bg-gray-100 rounded-full"><div className="h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all" style={{width:`${milestones.length?(milestones.filter(m=>m.status==='done').length/milestones.length)*100:0}%`}}/></div></div>
          {milestones.map(ms=>(
            <Card key={ms.id} className="p-5">
              <div className="flex items-start gap-4">
                <button onClick={()=>toggleMilestone(ms.id)} className={`text-xl mt-0.5 shrink-0 transition-colors ${msStatusColor(ms.status)}`}>{msStatusIcon(ms.status)}</button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className={`font-semibold text-gray-900 ${ms.status==='done'?'line-through text-gray-400':''}`}>{ms.title}</span>
                    <div className="flex items-center gap-2 shrink-0">{ms.isCritical&&<Badge variant="red">Critical</Badge>}<Badge variant={msStatusBadge(ms.status)}>{ms.status==='done'?'Done':ms.status==='in_progress'?'In Progress':'Pending'}</Badge><span className="text-xs text-gray-400 font-mono">{ms.date}</span></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{ms.description}</p>
                  {ms.notes?.length>0&&<div className="space-y-1 mb-3">{ms.notes.map((n,i)=><div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2"><span className="text-xs font-semibold text-indigo-600">{n.author}</span><span className="text-xs text-gray-600 flex-1">{n.text}</span><span className="text-xs text-gray-400">{n.time}</span></div>)}</div>}
                  <div className="flex gap-2"><input className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400" placeholder="Add a note for your team..." value={noteInput[ms.id]||''} onChange={e=>setNoteInput(n=>({...n,[ms.id]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addNote(ms.id)}/><button onClick={()=>addNote(ms.id)} className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-medium">Add Note</button></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==='team'&&(
        <div className="space-y-4">
          <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by name or user ID..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          {reassignMsg&&<div className={`text-sm px-4 py-2 rounded-xl border ${reassignMsg.startsWith('✓')?'bg-green-50 border-green-200 text-green-700':'bg-red-50 border-red-200 text-red-700'}`}>{reassignMsg}</div>}
          <div className="space-y-3">
            {filteredMembers.map((m,i)=>{
              const fns=project.functions.filter(f=>f.assignedTo===m.name);
              const bgs=['#1e40af','#9d174d','#92400e','#065f46','#4c1d95'];
              const rings=['#3b82f6','#ec4899','#f97316','#10b981','#8b5cf6'];
              return(
                <Card key={m.id||i} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{background:bgs[i%5],boxShadow:`0 0 0 2px white, 0 0 0 3px ${rings[i%5]}`}}>{m.name[0]?.toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1"><div><p className="font-semibold text-gray-900">{m.name}</p>{m.id&&<p className="text-xs text-gray-400 font-mono">{m.id}</p>}</div><button onClick={()=>{setReassignTarget(m.id||i);setReassignMsg('');}} className="text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 font-medium">Reassign</button></div>
                      <div className="flex flex-wrap gap-1.5 mt-2">{fns.map(f=><span key={f.id} className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full font-mono">{f.id} · {f.name}</span>)}{fns.length===0&&<span className="text-xs text-gray-400">No functions assigned</span>}</div>
                      {reassignTarget===(m.id||i)&&<div className="mt-3 flex gap-2"><input className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 font-mono" placeholder="Enter new User ID..." value={newUserId} onChange={e=>setNewUserId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&reassignMember()}/><button onClick={reassignMember} disabled={reassignLoading} className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">{reassignLoading?'...':'Confirm'}</button><button onClick={()=>{setReassignTarget(null);setNewUserId('');}} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button></div>}
                    </div>
                  </div>
                </Card>
              );
            })}
            {filteredMembers.length===0&&<div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">No members match "{search}"</div>}
          </div>
        </div>
      )}

      {tab==='ai'&&(
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500"/>AI Optimization</h3>
            <p className="text-sm text-gray-500 mb-4">Describe a goal and the AI will analyze your project and suggest roadmap changes.</p>
            <div className="flex gap-2 mb-4"><input className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder='e.g. "Optimize workload for the final week before deadline"' value={aiGoal} onChange={e=>setAiGoal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAiOptimization()}/><Btn variant="primary" onClick={runAiOptimization} disabled={aiLoading||!aiGoal.trim()}>{aiLoading?<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>:'Run'}</Btn></div>
            {aiResult&&<div className="space-y-3"><div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4"><p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Goal</p><p className="text-sm text-indigo-900">{aiResult.goal}</p></div><div className="bg-gray-50 border border-gray-200 rounded-xl p-4"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Insight</p><p className="text-sm text-gray-800 leading-relaxed">{aiResult.updatedInsight}</p></div>{aiResult.suggestion&&<div className="bg-blue-50 border border-blue-200 rounded-xl p-4"><p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Suggestion</p><p className="text-sm text-blue-900">{aiResult.suggestion}</p></div>}{aiResult.risks?.map((r,i)=><div key={i} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>{r}</div>)}{aiResult.predictedCompletion&&<p className="text-xs text-gray-400">Predicted completion: <span className="font-semibold text-gray-600">{aiResult.predictedCompletion}</span></p>}</div>}
          </Card>
          <Card className="p-6"><h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CalendarCheck className="w-5 h-5 text-amber-500"/>Meeting Scheduler</h3><p className="text-sm text-gray-500 mb-4">Generate a focused AI meeting agenda based on current project state.</p><Btn variant="secondary" icon={<ArrowRight className="w-4 h-4"/>} onClick={()=>setView('meeting')}>Open Meeting Scheduler</Btn></Card>
          <Card className="p-6"><h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><ListTodo className="w-5 h-5 text-pink-500"/>Personal To-Do List</h3><p className="text-sm text-gray-500 mb-4">AI generates a personal task list for each team member based on their assigned function.</p><Btn variant="secondary" icon={<ArrowRight className="w-4 h-4"/>} onClick={()=>setView('tasks')}>Open My Tasks</Btn></Card>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  MY TASKS
// ════════════════════════════════════════════════════════════
function MyTasks({ project }) {
  const [selected, setSelected] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (project?.members?.length) setSelected(project.members[0].name); }, [project]);

  async function loadTodos() {
    if (!project || !selected) return;
    const fn = project.functions.find(f => f.assignedTo === selected);
    if (!fn) { setTodos([]); return; }
    setLoading(true); setError('');
    try { const { data } = await axios.post(`${API}/ai/todos`, { projectName: project.name, projectDescription: project.description, detectedType: project.detectedType, deadline: project.deadline, memberName: selected, assignedFunction: fn, milestones: project.milestones }); setTodos(data.todos || []); }
    catch { setError('Failed to generate todos'); }
    setLoading(false);
  }

  function cycle(id) { setTodos(ts => ts.map(t => t.id===id ? {...t, status: t.status==='not_started'?'in_progress':t.status==='in_progress'?'done':'not_started'} : t)); }
  const pBadge = p => p==='High'?'red':p==='Medium'?'yellow':'green';
  const done = todos.filter(t => t.status==='done').length;

  if (!project) return <div className="text-center py-20 text-gray-400">No active project.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><ListTodo className="w-8 h-8 text-pink-500" /> My Tasks</h1><p className="text-gray-500 text-sm mt-1">AI-generated personal to-do list per member.</p></div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {project.members.map(m => (<button key={m.name} onClick={() => { setSelected(m.name); setTodos([]); }} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${selected===m.name ? 'bg-white shadow text-blue-600 border-blue-200 ring-1 ring-blue-200' : 'text-gray-500 border-transparent hover:bg-white/60'}`}><Avatar name={m.name} size="sm" />{m.name}</button>))}
        <Btn variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />} onClick={loadTodos} disabled={loading} className="ml-auto">{loading ? 'Generating...' : 'Generate Todos'}</Btn>
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
      {selected && (() => { const fn = project.functions.find(f => f.assignedTo===selected); if (!fn) return <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">No function assigned to {selected}</div>; return (<Card className="p-5 border-l-4 border-l-blue-500"><span className="text-xs font-mono text-blue-600 font-semibold">{fn.id}</span><p className="font-bold text-gray-900 mt-0.5">{fn.name}</p><p className="text-sm text-gray-500 mt-1">{fn.description}</p></Card>); })()}
      {todos.length > 0 && (<>
        <div className="space-y-3">{todos.map(t => (<Card key={t.id} className={`p-4 flex items-start gap-4 ${t.status==='done'?'opacity-60':''}`} hover><button onClick={() => cycle(t.id)} className="mt-0.5 shrink-0">{t.status==='done'?<CheckCircle2 className="w-5 h-5 text-green-500" />:t.status==='in_progress'?<Clock className="w-5 h-5 text-amber-500" />:<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}</button><div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-3 mb-1"><span className={`font-semibold text-gray-900 ${t.status==='done'?'line-through text-gray-400':''}`}>{t.task}</span><div className="flex items-center gap-1.5 shrink-0"><Badge variant={pBadge(t.priority)}>{t.priority}</Badge><Badge variant="gray">{t.estimatedHours}h</Badge></div></div>{t.tip && <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700"><span className="font-semibold">Tip: </span>{t.tip}</div>}<p className={`text-xs mt-2 font-medium ${t.status==='done'?'text-green-600':t.status==='in_progress'?'text-amber-600':'text-gray-400'}`}>{t.status==='done'?'✓ Done':t.status==='in_progress'?'◎ In Progress':'○ To Do'}</p></div></Card>))}</div>
        <Card className="p-4"><div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-600">{done} of {todos.length} completed</span><span className="text-sm font-bold text-green-600">{Math.round((done/todos.length)*100)}%</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-300" style={{ width: `${(done/todos.length)*100}%` }} /></div></Card>
      </>)}
      {todos.length===0 && !loading && selected && <div className="text-center py-16 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">Click "Generate Todos" to get AI tasks for {selected}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  MEETING SCHEDULER
// ════════════════════════════════════════════════════════════
function MeetingScheduler({ project }) {
  const [date, setDate] = useState('');
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    if (!date) { setError('Pick a meeting date'); return; }
    setError(''); setLoading(true);
    try {
      const memberProgress = project.members.map(m => { const fns = project.functions.filter(f => f.assignedTo===m.name); return { name: m.name, done: 0, inProgress: 0, skipped: 0, total: fns.length }; });
      const { data } = await axios.post(`${API}/ai/meeting-agenda`, { projectName: project.name, meetingDate: date, memberProgress, upcomingMilestones: project.milestones.slice(0,3) });
      setAgenda(data);
    } catch { setError('Failed to generate agenda'); }
    setLoading(false);
  }

  const pBadge = p => p==='Decide'?'red':p==='Action'?'orange':p==='Discuss'?'blue':'gray';
  if (!project) return <div className="text-center py-20 text-gray-400">No active project.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><CalendarCheck className="w-8 h-8 text-amber-500" /> Meeting Scheduler</h1><p className="text-gray-500 text-sm mt-1">AI generates a focused agenda based on current project state.</p></div>
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Meeting Date</label><input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={date} onChange={e => setDate(e.target.value)} /></div>
          <Btn variant="primary" icon={<Sparkles className="w-4 h-4" />} onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate Agenda'}</Btn>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </Card>
      {agenda && (<div className="space-y-4">
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Meeting Title</p><h2 className="text-xl font-bold text-gray-900">{agenda.meetingTitle}</h2></div><div className="text-right"><p className="text-xs text-gray-400">Total Duration</p><p className="text-3xl font-extrabold text-amber-600">{agenda.totalDuration}<span className="text-sm font-normal">min</span></p></div></div></Card>
        <div className="space-y-3">{agenda.agenda?.map((item,i) => (<Card key={i} className="p-4 flex items-start gap-4" hover><span className="text-2xl font-bold text-gray-200 w-8 shrink-0">{String(item.order).padStart(2,'0')}</span><div className="flex-1"><div className="flex items-start justify-between gap-3 mb-1"><span className="font-semibold text-gray-900">{item.item}</span><div className="flex items-center gap-1.5 shrink-0"><Badge variant={pBadge(item.purpose)}>{item.purpose}</Badge><Badge variant="gray">{item.durationMinutes}min</Badge></div></div><p className="text-xs text-gray-400">Owner: {item.owner}</p></div></Card>))}</div>
        {agenda.keyDecisionsNeeded?.length > 0 && (<Card className="p-5 border-amber-200 bg-amber-50/50"><div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 text-amber-600" /><p className="text-sm font-bold text-amber-800">Key Decisions Needed</p></div><div className="space-y-2">{agenda.keyDecisionsNeeded.map((d,i) => (<p key={i} className="text-sm text-amber-900 flex items-start gap-2"><span className="font-bold shrink-0">{i+1}.</span>{d}</p>))}</div></Card>)}
      </div>)}
      {!agenda && !loading && <div className="text-center py-16 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">Pick a date and generate your AI meeting agenda</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  GROUP HOME — Collaboration Dashboard
// ════════════════════════════════════════════════════════════
function GroupHome({ setView, project }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    axios.get(`${API}/projects`).then(({ data }) => {
      setProjects(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => setLoadingProjects(false));
  }, []);

  const stats = [
    { label: 'ACTIVE PROJECTS',  value: projects.length || '—', icon: <BarChart2 className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'COLLABORATORS',    value: projects.reduce((acc, p) => acc + (p.members?.length || 0), 0) || '—', icon: <Users className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
    { label: 'TASKS COMPLETED',  value: projects.reduce((acc, p) => acc + (p.functions?.filter(f => f.status === 'done')?.length || 0), 0) || '—', icon: <CheckCircle2 className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
    { label: 'MILESTONES',       value: projects.reduce((acc, p) => acc + (p.milestones?.length || 0), 0) || '—', icon: <Target className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600' },
  ];

  const quickActions = [
    { label: 'New Project',     sub: 'AI-driven setup',       icon: <Plus className="w-5 h-5" />,         color: 'bg-indigo-100 text-indigo-600', action: () => setView('newproject') },
    { label: 'Project Dashboard', sub: 'View health & insights', icon: <BarChart2 className="w-5 h-5" />, color: 'bg-teal-100 text-teal-600',    action: () => setView('dashboard') },
    { label: 'My Tasks',        sub: 'Review pending items',   icon: <ListTodo className="w-5 h-5" />,     color: 'bg-pink-100 text-pink-600',    action: () => setView('tasks') },
    { label: 'Meeting Scheduler', sub: 'Generate AI agenda',   icon: <CalendarCheck className="w-5 h-5" />,color: 'bg-amber-100 text-amber-600', action: () => setView('meeting') },
  ];

  const recentActivity = [
    { dot: 'bg-indigo-500', text: 'Project dashboard initialized', time: 'Just now' },
    { dot: 'bg-green-500',  text: 'AI milestones generated',       time: '5m ago'   },
    { dot: 'bg-purple-500', text: 'Team members added via ID',      time: '12m ago'  },
    { dot: 'bg-amber-500',  text: 'Meeting agenda created',         time: '1h ago'   },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'there'}!</h1>
          <p className="text-gray-500 mt-1">
            {projects.length > 0
              ? `You have ${projects.length} active project${projects.length > 1 ? 's' : ''}.`
              : 'Start by creating your first AI-powered project.'}
          </p>
        </div>
        <button onClick={() => setView('newproject')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>{s.icon}</div>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* My Projects + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">My Projects</h2>
            <button onClick={() => setView('dashboard')}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loadingProjects && (
            <div className="text-sm text-gray-400 py-8 text-center">Loading projects...</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map(p => {
              const done = p.milestones?.filter(m => m.status === 'done' || m.isCritical === false).length || 0;
              const total = p.milestones?.length || 1;
              const pct = Math.round((done / total) * 100);
              return (
                <Card key={p._id} className="p-5" hover>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wide">
                      {p.detectedType || 'Project'}
                    </span>
                    <button className="text-gray-300 hover:text-gray-500">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug">{p.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                    <CalendarDays className="w-3 h-3" /> Deadline: {p.deadline}
                  </p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      <span>Project Progress</span>
                      <span className="text-indigo-600">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex -space-x-2">
                      {p.members?.slice(0, 3).map((m, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold
                          ${['bg-blue-400','bg-purple-400','bg-teal-400','bg-orange-400','bg-pink-400'][i % 5]}`}>
                          {m.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      ))}
                      {(p.members?.length || 0) > 3 && (
                        <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          +{p.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                      ${pct === 0 ? 'bg-amber-50 text-amber-600' : pct >= 100 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {pct === 0 ? 'Planning' : pct >= 100 ? 'Complete' : 'In Progress'}
                    </span>
                  </div>
                </Card>
              );
            })}

            {/* New Project card */}
            <button onClick={() => setView('newproject')}
              className="rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 min-h-[180px]">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <p className="font-bold text-gray-700 text-sm">New Project</p>
              <p className="text-xs text-gray-400">Initiate AI-driven setup</p>
            </button>
          </div>
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <Card className="p-2">
              {quickActions.map((a, i) => (
                <button key={i} onClick={a.action}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                  <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{a.label}</p>
                    <p className="text-xs text-gray-400">{a.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                </button>
              ))}
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <Card className="p-4">
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{a.text}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileStub() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4"><User className="w-8 h-8 text-purple-500" /></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile</h2>
      <p className="text-gray-400 text-sm max-w-xs">Manage your account details and preferences.</p>
    </div>
  );
}

function SettingsStub() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><Settings className="w-8 h-8 text-gray-500" /></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
      <p className="text-gray-400 text-sm max-w-xs">Customize your UniLife OS experience.</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  LOGIN / SIGNUP PAGE
// ════════════════════════════════════════════════════════════
function LoginPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', major: '', year: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const f = (k, v) => setForm(x => ({ ...x, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        await signup(form.name, form.email, form.password, form.major, form.year);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-sm text-gray-400 mt-1">{mode === 'login' ? 'Sign in to UniLife OS' : 'Join UniLife OS'}</p>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="you@university.edu"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => f('password', e.target.value)} placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                <input value={form.major} onChange={e => f('major', e.target.value)} placeholder="e.g. CS"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input value={form.year} onChange={e => f('year', e.target.value)} placeholder="e.g. 2nd"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-blue-600 font-semibold hover:underline">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  ROOT — AppShell with sidebar + topbar
// ════════════════════════════════════════════════════════════
export default function App() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('landing');
  const [project, setProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show login page if not authenticated
  if (!user) return <LoginPage />;

  // Load most recent project from DB on mount
  useEffect(() => {
    axios.get(`${API}/projects`).then(({ data }) => {
      if (data.length > 0) setProject(data[0]);
    }).catch(() => {});
  }, []);

  const views = {
    landing:   <Landing setView={setView} />,
    create:    <GroupHome setView={setView} project={project} />,
    newproject:<CreateProject setView={setView} setProject={setProject} />,
    dashboard: <ProjectDashboard project={project} setView={setView} />,
    tasks:     <MyTasks project={project} />,
    meeting:   <MeetingScheduler project={project} />,
    profile:   <ProfileStub />,
    settings:  <SettingsStub />,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-64 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" style={{ animationDelay: '4s' }} />

      <Sidebar view={view} setView={setView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} logout={logout} />

      <div className="flex-1 lg:ml-64 flex flex-col h-screen relative z-10">
        <Navbar view={view} setSidebarOpen={setSidebarOpen} user={user} logout={logout} />
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {views[view] || views.landing}
          </div>
        </main>
      </div>
    </div>
  );
}
