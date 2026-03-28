import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Camera, Mail, Phone, MapPin, BookOpen, Edit2, CheckCircle2 } from 'lucide-react';

export function Profile() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: 'Alex Student',
    email: 'alex.student@university.edu',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    major: 'Computer Science',
    year: '2nd Year',
    bio: 'Passionate about software engineering and AI. Always looking for new challenges and opportunities to grow.',
  });

  const validateField = (key, value) => {
    if (key === 'name' && !value.trim()) return 'Full name is required';
    if (key === 'email') {
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
    }
    if (key === 'phone' && value && !/^\+?[\d\s\-().]{7,15}$/.test(value))
      return 'Enter a valid phone number';
    if (key === 'major' && !value.trim()) return 'Major is required';
    if (key === 'year' && !value.trim()) return 'Year is required';
    return '';
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const handleSave = () => {
    const e = {};
    ['name', 'email', 'phone', 'major', 'year'].forEach((key) => {
      const msg = validateField(key, form[key]);
      if (msg) e[key] = msg;
    });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (label, key, icon, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      {editing ? (
        <>
          <input
            type={type}
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-100 border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 transition-colors ${
              errors[key] ? 'border-red-400 bg-red-50' : 'border-transparent'
            }`}
          />
          {errors[key] && (
            <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-gray-400">{icon}</span>
          {form[key]}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header card */}
      <Card className="p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-gray-900">{form.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{form.major} · {form.year}</p>
            <p className="text-gray-400 text-sm mt-3 max-w-md">{form.bio}</p>
          </div>

          <div className="shrink-0">
            {saved ? (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Saved
              </span>
            ) : editing ? (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => { setEditing(false); setErrors({}); }}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" icon={<Edit2 className="w-4 h-4" />} onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Info card */}
      <Card className="p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {field('Full Name', 'name', null)}
          {field('Email', 'email', <Mail className="w-4 h-4" />, 'email')}
          {field('Phone', 'phone', <Phone className="w-4 h-4" />, 'tel')}
          {field('Location', 'location', <MapPin className="w-4 h-4" />)}
          {field('Major', 'major', <BookOpen className="w-4 h-4" />)}
          {field('Year', 'year', null)}
        </div>

        {editing && (
          <div className="mt-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 resize-none"
            />
          </div>
        )}
      </Card>

      {/* Stats card */}
      <Card className="p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Academic Overview</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Tasks Done', value: '24' },
            { label: 'Study Hours', value: '128h' },
            { label: 'Day Streak', value: '5' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
