import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email is required';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) {
      login({ email: formData.email });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-[540px]">

        {/* ── Left panel ── */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex-col items-center justify-between p-10 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-purple-400/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center flex-1 justify-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Welcome to</p>
              <h2 className="text-white text-3xl font-extrabold">UniLife OS</h2>
            </div>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Your all-in-one student operating system. Manage tasks, track wellbeing, collaborate, and stay on budget.
            </p>
          </div>

          <div className="relative z-10 flex gap-6 text-white/60 text-xs font-semibold tracking-widest uppercase">
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button>
            <span>|</span>
            <button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">Create Account</button>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-10">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Sign in to your account</h1>
          <p className="text-sm text-gray-400 mb-8">Welcome back — let's get you back on track.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded accent-blue-600" />
                Remember me
              </label>
              <button type="button" className="text-blue-600 hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex justify-center gap-4">
            {['G', 'f', 'X', ''].map((label, i) => (
              <button
                key={i}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm transition-all hover:scale-105"
              >
                {i === 0 && <span className="text-red-500 font-extrabold">G</span>}
                {i === 1 && <span className="text-blue-600 font-extrabold">f</span>}
                {i === 2 && <span className="text-gray-800 font-extrabold">𝕏</span>}
                {i === 3 && <span className="text-gray-800 text-base"></span>}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-blue-600 font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
