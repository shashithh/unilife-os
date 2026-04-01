import { useState } from 'react';
import axios from 'axios';

const s = {
  card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 20 },
  topRow: { display: 'flex', alignItems: 'center', gap: 20 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 72, height: 72, borderRadius: '50%', background: '#e0e4ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
  },
  badge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: '50%', background: '#5b6ef5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff',
  },
  name: { fontSize: 20, fontWeight: 700 },
  role: { fontSize: 13, color: '#888', marginBottom: 6 },
  bio: { fontSize: 13, color: '#666' },
  editBtn: {
    marginLeft: 'auto', padding: '8px 16px', borderRadius: 8,
    border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  field: {},
  fieldLabel: { fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: 0.5, marginBottom: 4 },
  fieldVal: { fontSize: 14, color: '#333', display: 'flex', alignItems: 'center', gap: 6 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 },
  stat: { background: '#f4f6fb', borderRadius: 12, padding: '20px', textAlign: 'center' },
  statNum: { fontSize: 28, fontWeight: 800, color: '#1a1a2e' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #e5e7eb', fontSize: 14, outline: 'none',
  },
  saveBtn: {
    padding: '10px 24px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(90deg,#5b6ef5,#7c3aed)', color: '#fff',
    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 16,
  },
};

export default function Profile({ user, onUserUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    major: user?.major || '',
    year: user?.year || '',
    bio: user?.bio || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`/api/users/${user._id}`, form);
      onUserUpdate(data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally { setSaving(false); }
  };

  return (
    <div>
      {/* Profile Header */}
      <div style={s.card}>
        <div style={s.topRow}>
          <div style={s.avatarWrap}>
            <div style={s.avatar}>👤</div>
            <div style={s.badge}>📷</div>
          </div>
          <div>
            <div style={s.name}>{user?.name || 'Student'}</div>
            <div style={s.role}>{user?.major || 'Computer Science'} · {user?.year || '2nd Year'}</div>
            <div style={s.bio}>{user?.bio || 'Passionate about software engineering and AI.'}</div>
          </div>
          <button style={s.editBtn} onClick={() => setEditing(!editing)}>
            ✏️ {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div style={s.card}>
        <div style={s.sectionTitle}>Personal Information</div>
        {editing ? (
          <div style={s.grid}>
            {[
              { name: 'name', label: 'FULL NAME' },
              { name: 'email', label: 'EMAIL' },
              { name: 'phone', label: 'PHONE' },
              { name: 'location', label: 'LOCATION' },
              { name: 'major', label: 'MAJOR' },
              { name: 'year', label: 'YEAR' },
            ].map(f => (
              <div key={f.name} style={s.field}>
                <div style={s.fieldLabel}>{f.label}</div>
                <input style={s.input} name={f.name} value={form[f.name]} onChange={handleChange} />
              </div>
            ))}
          </div>
        ) : (
          <div style={s.grid}>
            <div style={s.field}>
              <div style={s.fieldLabel}>FULL NAME</div>
              <div style={s.fieldVal}>{user?.name || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.fieldLabel}>EMAIL</div>
              <div style={s.fieldVal}>✉️ {user?.email || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.fieldLabel}>PHONE</div>
              <div style={s.fieldVal}>📞 {user?.phone || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.fieldLabel}>LOCATION</div>
              <div style={s.fieldVal}>📍 {user?.location || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.fieldLabel}>MAJOR</div>
              <div style={s.fieldVal}>📋 {user?.major || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.fieldLabel}>YEAR</div>
              <div style={s.fieldVal}>{user?.year || '—'}</div>
            </div>
          </div>
        )}
        {editing && (
          <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Academic Overview */}
      <div style={s.card}>
        <div style={s.sectionTitle}>Academic Overview</div>
        <div style={s.statsRow}>
          <div style={s.stat}><div style={s.statNum}>24</div><div style={s.statLabel}>Tasks Done</div></div>
          <div style={s.stat}><div style={s.statNum}>128h</div><div style={s.statLabel}>Study Hours</div></div>
          <div style={s.stat}><div style={s.statNum}>5</div><div style={s.statLabel}>Day Streak</div></div>
        </div>
      </div>
    </div>
  );
}
