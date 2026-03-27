import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Plus, Users, Target, Flame, ChevronRight,
  CheckCircle2, Clock, AlertCircle, X, Sparkles,
  UserPlus, Mail, Trash2, ChevronLeft
} from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────────────────────────

const TEAM = ['Alex', 'Jordan', 'Sam', 'Riley', 'Morgan'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: 'Research Paper – AI Ethics',
    color: 'from-blue-600 to-purple-600',
    accent: 'blue',
    progress: 74,
    milestones: { reached: 3, total: 5 },
    team: ['Alex', 'Jordan', 'Sam'],
    timeline: [
      { id: 't1', label: 'Topic Selection',    start: 0, span: 1, done: true  },
      { id: 't2', label: 'Literature Review',  start: 1, span: 2, done: true  },
      { id: 't3', label: 'Draft Writing',      start: 3, span: 3, done: false },
      { id: 't4', label: 'Peer Review',        start: 6, span: 2, done: false },
      { id: 't5', label: 'Final Submission',   start: 8, span: 1, done: false },
    ],
  },
  {
    id: 2,
    name: 'Mobile App – Campus Guide',
    color: 'from-teal-500 to-cyan-600',
    accent: 'teal',
    progress: 41,
    milestones: { reached: 2, total: 6 },
    team: ['Riley', 'Morgan', 'Alex'],
    timeline: [
      { id: 't1', label: 'Wireframes',         start: 0, span: 2, done: true  },
      { id: 't2', label: 'UI Design',          start: 2, span: 2, done: true  },
      { id: 't3', label: 'Frontend Dev',       start: 4, span: 3, done: false },
      { id: 't4', label: 'Backend API',        start: 4, span: 4, done: false },
      { id: 't5', label: 'Testing',            start: 8, span: 1, done: false },
      { id: 't6', label: 'Launch',             start: 9, span: 1, done: false },
    ],
  },
];

const HEATMAP_DATA = {
  Alex:   [2, 4, 3, 5, 2, 1, 0],
  Jordan: [1, 2, 4, 3, 5, 0, 0],
  Sam:    [3, 3, 2, 1, 4, 2, 1],
  Riley:  [0, 1, 3, 4, 3, 1, 0],
  Morgan: [2, 2, 1, 2, 2, 3, 0],
};

const INITIAL_FEED = [
  { id: 1, user: 'Jordan', action: 'completed', target: 'Literature Review',   time: '2m ago',  icon: 'check' },
  { id: 2, user: 'Sam',    action: 'commented on', target: 'Draft Writing',    time: '8m ago',  icon: 'chat'  },
  { id: 3, user: 'Riley',  action: 'uploaded',  target: 'UI Mockup v2.pdf',    time: '15m ago', icon: 'file'  },
  { id: 4, user: 'Alex',   action: 'started',   target: 'Frontend Dev',        time: '22m ago', icon: 'play'  },
  { id: 5, user: 'Morgan', action: 'joined',    target: 'Campus Guide project', time: '1h ago', icon: 'user'  },
];

const FEED_POOL = [
  (u) => ({ user: u, action: 'completed',   target: 'a task',           icon: 'check' }),
  (u) => ({ user: u, action: 'commented on', target: 'the timeline',    icon: 'chat'  }),
  (u) => ({ user: u, action: 'uploaded',    target: 'a new file',       icon: 'file'  }),
  (u) => ({ user: u, action: 'started',     target: 'a new milestone',  icon: 'play'  }),
];

// ── Milestone board data ───────────────────────────────────────────────────────

const MILESTONES = [
  {
    id: 'm1',
    title: 'Topic Selection',
    phase: 'Discovery',
    progress: 100,
    status: 'done',
    due: '2025-01-10',
    members: ['Alex', 'Jordan'],
    criticalPath: false,
  },
  {
    id: 'm2',
    title: 'Literature Review',
    phase: 'Research',
    progress: 100,
    status: 'done',
    due: '2025-02-01',
    members: ['Sam', 'Jordan'],
    criticalPath: false,
  },
  {
    id: 'm3',
    title: 'Draft Writing',
    phase: 'Execution',
    progress: 62,
    status: 'active',
    due: '2025-03-15',
    members: ['Alex', 'Sam', 'Riley'],
    criticalPath: true,
  },
  {
    id: 'm4',
    title: 'Peer Review',
    phase: 'Review',
    progress: 0,
    status: 'overdue',
    due: '2025-03-01',
    members: ['Jordan', 'Morgan'],
    criticalPath: true,
  },
  {
    id: 'm5',
    title: 'Final Submission',
    phase: 'Delivery',
    progress: 0,
    status: 'upcoming',
    due: '2025-04-20',
    members: ['Alex'],
    criticalPath: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function heatColor(val) {
  if (val === 0) return 'bg-gray-100 text-gray-300';
  if (val <= 2)  return 'bg-green-200 text-green-700';
  if (val <= 3)  return 'bg-yellow-200 text-yellow-700';
  return 'bg-red-200 text-red-600';
}

function avatarColor(name) {
  const colors = ['bg-blue-400', 'bg-purple-400', 'bg-teal-400', 'bg-orange-400', 'bg-pink-400'];
  return colors[name.charCodeAt(0) % colors.length];
}

function FeedIcon({ type }) {
  const base = 'w-4 h-4';
  if (type === 'check') return <CheckCircle2 className={`${base} text-green-500`} />;
  if (type === 'file')  return <Target className={`${base} text-blue-500`} />;
  if (type === 'play')  return <Flame className={`${base} text-orange-500`} />;
  if (type === 'user')  return <Users className={`${base} text-purple-500`} />;
  return <Clock className={`${base} text-gray-400`} />;
}

// ── Ring progress ──────────────────────────────────────────────────────────────

function RingProgress({ value, size = 80, stroke = 7, color = '#6366f1', label, sub }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="#e5e7eb" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900 leading-none">{value}%</span>
        </div>
      </div>
      {label && <p className="text-xs font-semibold text-gray-700 text-center">{label}</p>}
      {sub   && <p className="text-xs text-gray-400 text-center">{sub}</p>}
    </div>
  );
}

// ── Milestone Board ────────────────────────────────────────────────────────────

function MiniRing({ value, overdue, done }) {
  const size = 52, stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = done ? '#22c55e' : overdue ? '#ef4444' : '#818cf8';
  const glow  = done ? '#22c55e' : overdue ? '#ef4444' : '#6366f1';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${glow})`, transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{value}%</span>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, index }) {
  const isOverdue  = milestone.status === 'overdue';
  const isDone     = milestone.status === 'done';
  const isActive   = milestone.status === 'active';
  const isCritical = milestone.criticalPath && !isDone;

  const borderColor = isDone     ? 'border-green-500/30'
                    : isOverdue  ? 'border-red-500/50'
                    : isActive   ? 'border-indigo-500/40'
                    : 'border-white/10';

  const glowClass   = isOverdue  ? 'shadow-[0_0_24px_rgba(239,68,68,0.35)]'
                    : isActive   ? 'shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                    : isDone     ? 'shadow-[0_0_16px_rgba(34,197,94,0.2)]'
                    : 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]';

  const phaseColor  = isDone    ? 'text-green-400 bg-green-500/10'
                    : isOverdue ? 'text-red-400 bg-red-500/10'
                    : isActive  ? 'text-indigo-300 bg-indigo-500/10'
                    : 'text-gray-400 bg-white/5';

  return (
    <div className={`
      relative flex flex-col items-center
      ${index % 2 === 0 ? 'justify-end pb-8' : 'justify-start pt-8'}
    `} style={{ minWidth: 180 }}>

      {/* Connector dot on the rail */}
      <div className={`
        absolute ${index % 2 === 0 ? 'bottom-0' : 'top-0'}
        w-4 h-4 rounded-full border-2 z-10
        ${isDone    ? 'bg-green-400 border-green-300 shadow-[0_0_10px_#22c55e]'
        : isOverdue ? 'bg-red-500   border-red-400   shadow-[0_0_12px_#ef4444] animate-pulse'
        : isActive  ? 'bg-indigo-400 border-indigo-300 shadow-[0_0_10px_#818cf8]'
        : 'bg-gray-600 border-gray-500'}
      `} style={{ left: '50%', transform: 'translateX(-50%)' }} />

      {/* Connector line */}
      <div className={`
        absolute w-px ${index % 2 === 0 ? 'bottom-4 h-6' : 'top-4 h-6'}
        ${isDone ? 'bg-green-500/40' : isOverdue ? 'bg-red-500/40' : 'bg-white/10'}
      `} style={{ left: '50%' }} />

      {/* Card */}
      <div className={`
        w-44 rounded-2xl border backdrop-blur-xl p-4 flex flex-col gap-3
        bg-white/5 ${borderColor} ${glowClass}
        transition-all duration-300 hover:scale-[1.03] hover:bg-white/8 cursor-pointer
        ${isCritical ? 'ring-1 ring-red-500/30' : ''}
      `}>
        {/* Critical path badge */}
        {isCritical && (
          <div className="flex items-center gap-1 text-red-400 text-[10px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
            Critical Path
          </div>
        )}

        {/* Phase tag */}
        <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full ${phaseColor}`}>
          {milestone.phase}
        </span>

        {/* Title + ring */}
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-semibold leading-tight flex-1 ${isDone ? 'text-gray-400 line-through' : 'text-white'}`}>
            {milestone.title}
          </p>
          <MiniRing value={milestone.progress} overdue={isOverdue} done={isDone} />
        </div>

        {/* Due date */}
        <p className={`text-[11px] ${isOverdue ? 'text-red-400 font-semibold' : 'text-gray-500'}`}>
          {isOverdue ? '⚠ Overdue · ' : 'Due · '}
          {new Date(milestone.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>

        {/* Avatars */}
        <div className="flex -space-x-2">
          {milestone.members.map((m) => (
            <div key={m}
              title={m}
              className={`w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center text-white text-[10px] font-bold ${avatarColor(m)}`}>
              {m[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestoneBoard() {
  return (
    <div className="rounded-3xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #12122a 50%, #0d1117 100%)' }}>

      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Milestone Board
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Critical path · Visual timeline · Team progress</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Done</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />Active</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />Overdue</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />Upcoming</span>
        </div>
      </div>

      {/* Board */}
      <div className="px-8 pb-10 overflow-x-auto scrollbar-hide">
        <div className="relative" style={{ minWidth: MILESTONES.length * 196 + 64 }}>

          {/* Glowing rail */}
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent, #6366f1 15%, #818cf8 50%, #6366f1 85%, transparent)',
              boxShadow: '0 0 16px 2px rgba(99,102,241,0.5)',
            }} />

          {/* Cards row */}
          <div className="flex gap-4 py-2" style={{ height: 380 }}>
            {MILESTONES.map((m, i) => (
              <MilestoneCard key={m.id} milestone={m} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="border-t border-white/5 px-8 py-4 flex items-center gap-8">
        {[
          { label: 'Completed',  val: MILESTONES.filter(m => m.status === 'done').length,    color: 'text-green-400' },
          { label: 'In Progress',val: MILESTONES.filter(m => m.status === 'active').length,  color: 'text-indigo-400' },
          { label: 'Overdue',    val: MILESTONES.filter(m => m.status === 'overdue').length, color: 'text-red-400' },
          { label: 'Upcoming',   val: MILESTONES.filter(m => m.status === 'upcoming').length,color: 'text-gray-500' },
        ].map(({ label, val, color }) => (
          <div key={label} className="flex flex-col">
            <span className={`text-2xl font-bold ${color}`}>{val}</span>
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
          Live · synced just now
        </div>
      </div>
    </div>
  );
}

// ── Add Project Modal ──────────────────────────────────────────────────────────

const PROJECT_TYPES = ['Development', 'Research', 'Testing', 'Design', 'Marketing'];
const NAME_MAX = 50;

const FIELD = 'w-full px-4 py-2.5 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all';
const ERR   = 'border-red-400 focus:ring-red-400';
const OK    = 'border-gray-200';

function FieldError({ msg }) {
  return msg ? <span className="text-xs text-red-500 mt-0.5">{msg}</span> : null;
}

function AddProjectModal({ onClose, onAdd }) {
  // step 1 = project details, step 2 = add members
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name:     '',
    key:      '',
    deadline: '',
    type:     '',
    lead:     '',
  });
  const [errors, setErrors] = useState({});

  // members state
  const [members, setMembers]       = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const set = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  // auto-generate key from name
  const handleNameChange = (val) => {
    const trimmed = val.slice(0, NAME_MAX);
    const autoKey = 'UL-' + trimmed.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
    setForm((p) => ({ ...p, name: trimmed, key: p.key || autoKey }));
    setErrors((p) => ({ ...p, name: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())     e.name     = 'Project name is required';
    if (!form.key.trim())      e.key      = 'Project key is required';
    else if (!/^[A-Z0-9-]{2,10}$/.test(form.key)) e.key = 'Use 2–10 uppercase letters, digits or hyphens';
    if (!form.deadline)        e.deadline = 'Deadline is required';
    else if (new Date(form.deadline) < new Date()) e.deadline = 'Deadline must be in the future';
    if (!form.type)            e.type     = 'Select a project type';
    if (!form.lead)            e.lead     = 'Add a short description';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addMember = () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.trim())          { setEmailError('Email is required'); return; }
    if (!emailRe.test(emailInput))   { setEmailError('Enter a valid email address'); return; }
    if (members.includes(emailInput.toLowerCase())) { setEmailError('Already added'); return; }
    setMembers((p) => [...p, emailInput.toLowerCase()]);
    setEmailInput('');
    setEmailError('');
  };

  const handleSubmit = () => {
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      key: form.key,
      deadline: form.deadline,
      type: form.type,
      lead: form.lead,
      members,
      color: 'from-indigo-500 to-purple-600',
      accent: 'purple',
      progress: 0,
      milestones: { reached: 0, total: 4 },
      team: [form.lead, ...members.map((m) => m.split('@')[0])],
      timeline: [
        { id: 'n1', label: 'Kickoff',   start: 0, span: 1, done: false },
        { id: 'n2', label: 'Planning',  start: 1, span: 2, done: false },
        { id: 'n3', label: 'Execution', start: 3, span: 4, done: false },
        { id: 'n4', label: 'Delivery',  start: 7, span: 1, done: false },
      ],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative animate-fade-in overflow-hidden">

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 mr-1">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <h3 className="text-xl font-bold text-gray-900">
                  {step === 1 ? 'New Project' : 'Add Members'}
                </h3>
              </div>
              <p className="text-sm text-gray-400">
                Step {step} of 2 — {step === 1 ? 'Project details' : 'Invite your team'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="space-y-4">

              {/* Project Name + counter */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">Project Name</label>
                  <span className={`text-xs ${form.name.length >= NAME_MAX ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.name.length}/{NAME_MAX}
                  </span>
                </div>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Machine Learning Study Group"
                  className={`${FIELD} ${errors.name ? ERR : OK}`}
                />
                <FieldError msg={errors.name} />
              </div>

              {/* Key + Deadline side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Project Key</label>
                  <input
                    value={form.key}
                    onChange={(e) => set('key', e.target.value.toUpperCase().slice(0, 10))}
                    placeholder="e.g. UL-01"
                    className={`${FIELD} font-mono ${errors.key ? ERR : OK}`}
                  />
                  <FieldError msg={errors.key} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Final Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set('deadline', e.target.value)}
                    className={`${FIELD} ${errors.deadline ? ERR : OK}`}
                  />
                  <FieldError msg={errors.deadline} />
                </div>
              </div>

              {/* Type + Lead side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Project Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => set('type', e.target.value)}
                    className={`${FIELD} ${errors.type ? ERR : OK}`}
                  >
                    <option value="" disabled>Select type</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <FieldError msg={errors.type} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={form.lead}
                    onChange={(e) => set('lead', e.target.value)}
                    placeholder="Brief project description..."
                    rows={3}
                    className={`${FIELD} resize-none ${errors.lead ? ERR : OK}`}
                  />
                  <FieldError msg={errors.lead} />
                </div>
              </div>

              {/* Type hint */}
              {form.type && (
                <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                  <span className="font-semibold">{form.type}</span> template will auto-generate
                  {form.type === 'Development' && ' sprint-based milestones.'}
                  {form.type === 'Research'    && ' literature & draft phases.'}
                  {form.type === 'Testing'     && ' QA and regression phases.'}
                  {form.type === 'Design'      && ' wireframe and review phases.'}
                  {form.type === 'Marketing'   && ' campaign and launch phases.'}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button
                  type="button"
                  variant="primary"
                  icon={<UserPlus className="w-4 h-4" />}
                  onClick={() => { if (validateStep1()) setStep(2); }}
                >
                  Next: Add Members
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="space-y-4">

              {/* Email input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Invite by Email</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                      placeholder="teammate@university.edu"
                      className={`${FIELD} pl-9 ${emailError ? ERR : OK}`}
                    />
                  </div>
                  <Button type="button" variant="secondary" onClick={addMember}
                    icon={<Plus className="w-4 h-4" />}>
                    Add
                  </Button>
                </div>
                <FieldError msg={emailError} />
                <p className="text-xs text-gray-400">Press Enter or click Add. They'll receive an invite link.</p>
              </div>

              {/* Members list */}
              {members.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-hide">
                  {members.map((email) => (
                    <div key={email} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
                      <div className={`w-7 h-7 rounded-full ${avatarColor(email)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {email[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700 flex-1 truncate">{email}</span>
                      <button
                        onClick={() => setMembers((p) => p.filter((m) => m !== email))}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {members.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                  No members added yet. You can skip and add later.
                </div>
              )}

              {/* Lead summary */}
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl text-sm text-blue-700">
                <Users className="w-4 h-4 shrink-0" />
                <span>You are the <span className="font-semibold">Team Lead</span> for this project.</span>
              </div>

              <div className="flex justify-between gap-3 pt-2 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}
                  icon={<ChevronLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button type="button" variant="primary" onClick={handleSubmit}>
                  Create Project
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Timeline ───────────────────────────────────────────────────────────────────

function Timeline({ project }) {
  const cols = 10;
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        {/* Column headers */}
        <div className="grid mb-2" style={{ gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}>
          <div />
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} className="text-center text-xs text-gray-400 font-medium">W{i + 1}</div>
          ))}
        </div>
        {/* Rows */}
        <div className="space-y-2">
          {project.timeline.map((item) => (
            <div key={item.id} className="grid items-center gap-1"
              style={{ gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}>
              <span className={`text-xs font-medium truncate pr-2 ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {Array.from({ length: cols }, (_, col) => {
                const inSpan = col >= item.start && col < item.start + item.span;
                const isStart = col === item.start;
                const isEnd   = col === item.start + item.span - 1;
                if (!inSpan) return <div key={col} className="h-6" />;
                return (
                  <div key={col} className={`h-6 flex items-center
                    ${item.done
                      ? 'bg-green-400'
                      : `bg-gradient-to-r ${project.color}`}
                    ${isStart ? 'rounded-l-full' : ''}
                    ${isEnd   ? 'rounded-r-full' : ''}
                    opacity-90`}
                  >
                    {isStart && (
                      <span className="text-white text-[10px] font-semibold pl-2 truncate leading-none">
                        {item.done ? '✓' : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export function GroupCollaboration() {
  const [projects, setProjects]       = useState(INITIAL_PROJECTS);
  const [activeProject, setActive]    = useState(INITIAL_PROJECTS[0]);
  const [showModal, setShowModal]     = useState(false);
  const [feed, setFeed]               = useState(INITIAL_FEED);

  // Simulate live activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      const user   = TEAM[Math.floor(Math.random() * TEAM.length)];
      const tpl    = FEED_POOL[Math.floor(Math.random() * FEED_POOL.length)];
      const entry  = { id: Date.now(), time: 'just now', ...tpl(user) };
      setFeed((prev) => [entry, ...prev.slice(0, 9)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleAddProject = (project) => {
    setProjects((prev) => [...prev, project]);
    setActive(project);
  };

  const proj = projects.find((p) => p.id === activeProject.id) || projects[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Group Collaboration
          </h1>
          <p className="text-gray-500 text-sm">Manage projects, track progress, and stay in sync with your team.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Project
        </Button>
      </div>

      {/* Project tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
              ${proj.id === p.id
                ? 'bg-white shadow text-blue-600 border-blue-100 ring-1 ring-blue-200'
                : 'text-gray-500 border-transparent hover:bg-white/60 hover:text-gray-800'}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* ── Row 1: Analytics + Heatmap + Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Analytics widgets */}
        <div className="space-y-4">
          {/* Project Progress */}
          <Card className="p-5 bg-white/60 backdrop-blur-xl border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">Project Progress</p>
              <Badge variant="blue">{proj.name.split('–')[0].trim()}</Badge>
            </div>
            <div className="flex items-center justify-around">
              <RingProgress
                value={proj.progress}
                size={90}
                stroke={8}
                color="#6366f1"
                label="Overall"
                sub="completion"
              />
              <RingProgress
                value={Math.round((proj.milestones.reached / proj.milestones.total) * 100)}
                size={90}
                stroke={8}
                color="#14b8a6"
                label="Milestones"
                sub={`${proj.milestones.reached} / ${proj.milestones.total}`}
              />
            </div>
          </Card>

          {/* Team members */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: '#121212',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 0 24px rgba(0,0,0,0.6)',
            }}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Team Members
            </p>
            <div className="space-y-3">
              {proj.team.map((member) => {
                const palette = {
                  Alex:   { bg: '#1e40af', ring: '#3b82f6', dot: '#60a5fa' },
                  Jordan: { bg: '#9d174d', ring: '#ec4899', dot: '#f472b6' },
                  Sam:    { bg: '#92400e', ring: '#f97316', dot: '#fb923c' },
                  Riley:  { bg: '#065f46', ring: '#10b981', dot: '#34d399' },
                  Morgan: { bg: '#4c1d95', ring: '#8b5cf6', dot: '#a78bfa' },
                };
                const colors = palette[member] || { bg: '#1f2937', ring: '#6b7280', dot: '#9ca3af' };
                return (
                  <div key={member} className="flex items-center gap-3 group">
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{
                        background: colors.bg,
                        boxShadow: `0 0 0 2px #121212, 0 0 0 3px ${colors.ring}`,
                      }}
                    >
                      {member[0]}
                    </div>

                    {/* Name */}
                    <span className="text-sm font-medium text-gray-200 flex-1 tracking-tight">
                      {member}
                    </span>

                    {/* Active indicator */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: colors.dot, boxShadow: `0 0 6px ${colors.dot}` }}
                      />
                      <span className="text-xs text-gray-600 font-medium">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workload Heatmap */}
        <Card className="p-5 bg-white/60 backdrop-blur-xl border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">Workload Heatmap</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm bg-green-200 inline-block" /> Low
              <span className="w-3 h-3 rounded-sm bg-yellow-200 inline-block ml-1" /> Med
              <span className="w-3 h-3 rounded-sm bg-red-200 inline-block ml-1" /> High
            </div>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div />
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-gray-400 font-medium">{d}</div>
            ))}
          </div>
          {/* Member rows */}
          {TEAM.map((member) => (
            <div key={member} className="grid grid-cols-8 gap-1 mb-1 items-center">
              <span className="text-xs text-gray-600 font-medium truncate">{member}</span>
              {HEATMAP_DATA[member].map((val, di) => (
                <div
                  key={di}
                  title={`${val} tasks`}
                  className={`h-7 rounded-md flex items-center justify-center text-xs font-semibold ${heatColor(val)}`}
                >
                  {val > 0 ? val : ''}
                </div>
              ))}
            </div>
          ))}
        </Card>

        {/* Activity Feed */}
        <div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: '#ffffff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-gray-100">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
            <p className="text-sm font-semibold text-gray-900 tracking-tight">Live Activity Feed</p>
          </div>

          {/* Scrollable list — native scrollbar visible */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: 300, scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
          >
            <style>{`
              .feed-scroll::-webkit-scrollbar { width: 6px; }
              .feed-scroll::-webkit-scrollbar-track { background: transparent; }
              .feed-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
              .feed-scroll::-webkit-scrollbar-button { display: block; height: 12px; background: #f3f4f6; }
            `}</style>
            <div className="feed-scroll overflow-y-auto" style={{ maxHeight: 300 }}>
              {feed.map((item, idx) => {
                const avatarPalette = {
                  Alex:   { bg: '#2563eb', text: '#fff' },
                  Jordan: { bg: '#db2777', text: '#fff' },
                  Sam:    { bg: '#ea580c', text: '#fff' },
                  Riley:  { bg: '#0891b2', text: '#fff' },
                  Morgan: { bg: '#0891b2', text: '#fff' },
                };
                const av = avatarPalette[item.user] || { bg: '#6b7280', text: '#fff' };
                const isFlame = item.icon === 'play';
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    style={{ opacity: idx === 0 ? 0.55 : 1 }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: av.bg, color: av.text }}
                    >
                      {item.user[0]}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">
                        <span className="font-semibold text-gray-900">{item.user}</span>
                        {' '}
                        <span className="text-gray-500">{item.action}</span>
                        {' '}
                        <span className="font-medium text-blue-500 hover:underline cursor-pointer">{item.target}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>

                    {/* Icon */}
                    {isFlame
                      ? <Flame className="w-4 h-4 shrink-0" style={{ color: '#f97316' }} />
                      : <Clock className="w-4 h-4 shrink-0 text-gray-300" />
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Timeline ── */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Project Timeline
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{proj.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Done
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-3 h-3 rounded-sm bg-gradient-to-r ${proj.color} inline-block`} /> In Progress
            </div>
          </div>
        </div>
        <Timeline project={proj} />
      </Card>

      {/* ── Row 3: Milestone Board ── */}
      <MilestoneBoard />

      {showModal && (
        <AddProjectModal onClose={() => setShowModal(false)} onAdd={handleAddProject} />
      )}
    </div>
  );
}
