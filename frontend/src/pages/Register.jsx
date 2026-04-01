import { useState } from 'react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const s = {
  title: { fontSize: 26, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 13, color: '#888', marginBottom: 28 },
  label: { fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#333' },
  input: {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: 'none', background: '#f0f2f8', fontSize: 14,
    outline: 'none', marginBottom: 16,
  },
  pwWrap: { position: 'relative', marginBottom: 16 },
  pwInput: {
    width: '100%', padding: '12px 40px 12px 16px', borderRadius: 10,
    border: 'none', background: '#f0f2f8', fontSize: 14, outline: 'none',
  },
  eye: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa', fontSize: 16 },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13 },
  link: { color: '#5b6ef5', fontWeight: 600 },
  btn: {
    width: '100%', padding: '13px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(90deg,#5b6ef5,#7c3aed)', color: '#fff',
    fontSize: 15, fontWeight: 700, marginBottom: 20,
  },
  divider: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: '#bbb', fontSize: 12 },
  line: { flex: 1, height: 1, background: '#e5e7eb' },
  socialRow: { display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 },
  social: {
    width: 40, height: 40, borderRadius: '50%', border: '1px solid #e5e7eb',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, cursor: 'pointer', background: '#fff',
  },
  bottom: { textAlign: 'center', fontSize: 13, color: '#888' },
  err: { color: 'red', fontSize: 12, marginBottom: 10 },
};

export default function Register({ onTabChange }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!agreed) return setError('Please agree to Terms and Conditions.');
    setLoading(true); setError('');
    try {
      await axios.post('/api/users/register', form);
      onTabChange('signin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout
      tagline="Create your account to unlock smart scheduling, productivity tracking, and everything student life needs."
      activeTab="register"
      onTabChange={onTabChange}
    >
      <div style={s.title}>Create your account</div>
      <div style={s.sub}>Join UniLife OS and take control of your student life.</div>
      {error && <div style={s.err}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label style={s.label}>Full Name</label>
        <input style={s.input} name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} required />
        <label style={s.label}>Email</label>
        <input style={s.input} name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange} required />
        <label style={s.label}>Password</label>
        <div style={s.pwWrap}>
          <input style={s.pwInput} name="password" type={showPw ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={handleChange} required />
          <span style={s.eye} onClick={() => setShowPw(!showPw)}>{showPw ? '🙈' : '👁'}</span>
        </div>
        <div style={s.checkRow}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <span>I agree to the <span style={s.link}>Terms and Conditions</span></span>
        </div>
        <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
      </form>
      <div style={s.divider}><div style={s.line} /><span>Sign up with</span><div style={s.line} /></div>
      <div style={s.socialRow}>
        <div style={{ ...s.social, color: '#ea4335' }}>G</div>
        <div style={{ ...s.social, color: '#1877f2' }}>f</div>
        <div style={{ ...s.social, color: '#000' }}>𝕏</div>
        <div style={s.social}>⚪</div>
      </div>
      <div style={s.bottom}>Already have an account? <span style={s.link} onClick={() => onTabChange('signin')}>Sign in</span></div>
    </AuthLayout>
  );
}
