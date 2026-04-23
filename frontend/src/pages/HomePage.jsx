import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  CheckCircle2,
  HeartPulse,
  LayoutDashboard,
  Wallet,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200">
      {/* 1. TOP NAVBAR */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-slate-800">
              UniLife OS
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Benefits</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/50"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
                  Log in
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/signup')}
                  className="shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/50"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-indigo-100/60 to-purple-50/60 blur-3xl opacity-80" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-100/60 to-emerald-50/60 blur-3xl opacity-70" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-sm font-semibold mb-8 tracking-wide shadow-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4" /> The future of student life
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Smart Student Life <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Simplified</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            UniLife OS is your intelligent campus companion. Seamlessly connect academics, wellbeing, and productivity in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto h-14 pl-6 pr-5 text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
            >
              Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg hover:-translate-y-1 transition-all bg-white"
              onClick={() => navigate('/login')}
            >
              Log into Account
            </Button>
          </div>
        </div>
      </header>

      {/* 3. FEATURE / MODULE SECTION */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-slate-600">
              Powerful modules designed specifically for university students to maintain balance and achieve peak performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Academic Planner",
                desc: "Manage tasks, deadlines, and view AI-optimized study schedules based on your priority.",
                icon: <LayoutDashboard className="w-7 h-7 text-blue-600" />,
                bg: "bg-blue-50",
                border: "group-hover:border-blue-200",
                shadow: "group-hover:shadow-blue-100"
              },
              {
                title: "Wellbeing Hub",
                desc: "Track your daily mood, monitor stress levels, and easily connect with campus counselors.",
                icon: <HeartPulse className="w-7 h-7 text-rose-600" />,
                bg: "bg-rose-50",
                border: "group-hover:border-rose-200",
                shadow: "group-hover:shadow-rose-100"
              },

              {
                title: "Budget Manager",
                desc: "Track expenses, manage university finances, and stay on top of personal budgeting.",
                icon: <Wallet className="w-7 h-7 text-emerald-600" />,
                bg: "bg-emerald-50",
                border: "group-hover:border-emerald-200",
                shadow: "group-hover:shadow-emerald-100"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl ${feature.shadow} ${feature.border} hover:-translate-y-2`}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 overflow-hidden relative`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE UNILIFE OS SECTION */}
      <section id="benefits" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Background decors */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
              <div className="p-10 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Built for the modern student lifecycle</h2>
                <p className="text-indigo-100/80 mb-10 text-lg leading-relaxed">
                  UniLife OS isn't just a planner—it's an intelligent system that adapts to your needs. Combining academic rigors with mental wellbeing ensures you stay at the top of your game gracefully.
                </p>
                <ul className="space-y-5">
                  {[
                    "Stay ahead: Never miss a deadline with smart alerts",
                    "Balance life: Monitor your burnout risk with AI analysis",
                    "Work smarter: Auto-generate optimized study routines",
                    "Connect easily: Book counseling sessions seamlessly"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-indigo-50 font-medium">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden lg:flex items-center justify-center p-10 bg-black/10 backdrop-blur-sm relative">
                <div className="w-full max-w-sm aspect-square relative grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4 translate-y-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col items-center justify-center text-center gap-3">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-300"><Target className="w-6 h-6"/></div>
                      <span className="font-semibold text-white">Focus Time</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col items-center justify-center text-center gap-3">
                      <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300"><ShieldCheck className="w-6 h-6"/></div>
                      <span className="font-semibold text-white">Safe Space</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 -translate-y-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col items-center justify-center text-center gap-3">
                      <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300"><Zap className="w-6 h-6"/></div>
                      <span className="font-semibold text-white">AI Engine</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col items-center justify-center text-center gap-3">
                      <div className="p-3 bg-rose-500/20 rounded-xl text-rose-300"><HeartPulse className="w-6 h-6"/></div>
                      <span className="font-semibold text-white">Wellbeing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-20 lg:py-32 bg-white text-center relative overflow-hidden text-slate-800">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-50 to-transparent"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready to transform your university experience?</h2>
            Join thousands of students who are already using UniLife OS to manage their tasks and maintain their mental wellbeing.
          <Button
            variant="primary"
            size="lg"
            className="h-14 px-10 text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
          >
            Start Your Smart Journey Today
          </Button>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="about" className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0 opacity-80">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <span className="text-lg font-bold text-slate-800 tracking-tight">UniLife OS</span>
          </div>
          
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}>Login</span>
            <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => navigate('/signup')}>Sign up</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-8 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} UniLife OS. All rights reserved. Integrating Academics & Wellbeing.
        </div>
      </footer>
    </div>
  );
}
