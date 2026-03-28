import { useNavigate } from "react-router-dom";
import {
  Smile,
  Activity,
  ShieldAlert,
  Calendar as CalendarIcon,
  MessageSquare,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Brain,
  Coffee,
  Moon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
const moodData = [
  {
    day: "Mon",
    score: 4
  },
  {
    day: "Tue",
    score: 3
  },
  {
    day: "Wed",
    score: 5
  },
  {
    day: "Thu",
    score: 4
  },
  {
    day: "Fri",
    score: 2
  },
  {
    day: "Sat",
    score: 4
  },
  {
    day: "Sun",
    score: 5
  }
];
export function WellbeingDashboard() {
  const navigate = useNavigate();
  return <div className="space-y-6 animate-fade-in">{
    /* Header Section */
  }<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"><div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Good morning, Alex <span className="text-2xl">👋</span></h1><p className="text-slate-500 mt-1">
            Here's your wellbeing overview for today.
          </p></div><div className="flex items-center gap-3"><Button
    variant="secondary"
    onClick={() => navigate("/support")}
    className="gap-2"
  ><ShieldAlert className="w-4 h-4 text-rose-500" />
            Anonymous Support
          </Button><Button
    variant="gradient"
    onClick={() => navigate("/mood")}
    className="gap-2"
  ><Smile className="w-4 h-4" />
            Log Mood
          </Button></div></div>{
    /* Top Stats Grid */
  }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><Card
    hoverable
    className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100/50"
  ><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Smile className="w-5 h-5" /></div><Badge variant="success">Logged Today</Badge></div><h3 className="text-sm font-medium text-slate-500">Today's Mood</h3><div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-bold text-slate-800">Calm</span><span className="text-xl">😌</span></div></CardContent></Card><Card
    hoverable
    className="bg-gradient-to-br from-rose-50 to-white border-rose-100/50"
  ><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-rose-100 rounded-xl text-rose-600"><Activity className="w-5 h-5" /></div><Badge variant="warning">Moderate</Badge></div><h3 className="text-sm font-medium text-slate-500">
              Current Stress
            </h3><div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-bold text-slate-800">Level 3</span><span className="text-sm text-slate-500">/ 5</span></div></CardContent></Card><Card
    hoverable
    className="bg-gradient-to-br from-teal-50 to-white border-teal-100/50"
    onClick={() => navigate("/risk")}
  ><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-teal-100 rounded-xl text-teal-600"><HeartPulse className="w-5 h-5" /></div><Badge variant="success">Low Risk</Badge></div><h3 className="text-sm font-medium text-slate-500">
              AI Risk Status
            </h3><div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-bold text-slate-800">Stable</span></div></CardContent></Card><Card
    hoverable
    className="bg-gradient-to-br from-purple-50 to-white border-purple-100/50"
    onClick={() => navigate("/counseling")}
  ><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-purple-100 rounded-xl text-purple-600"><CalendarIcon className="w-5 h-5" /></div><Badge variant="neutral">Upcoming</Badge></div><h3 className="text-sm font-medium text-slate-500">Next Session</h3><div className="mt-1 flex items-baseline gap-2"><span className="text-lg font-bold text-slate-800 truncate">
                Dr. Sarah J.
              </span><span className="text-sm text-slate-500">Tomorrow</span></div></CardContent></Card></div>{
    /* Main Content Grid */
  }<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{
    /* Left Column - Charts & Analytics */
  }<div className="lg:col-span-2 space-y-6"><Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle>Weekly Mood Trend</CardTitle><Button
    variant="ghost"
    size="sm"
    onClick={() => navigate("/analytics")}
    className="text-indigo-600"
  >
                
                View Full Analytics <ArrowRight className="w-4 h-4 ml-1" /></Button></CardHeader><CardContent><div className="h-[250px] w-full mt-4"><ResponsiveContainer width="100%" height="100%"><LineChart
    data={moodData}
    margin={{
      top: 5,
      right: 20,
      bottom: 5,
      left: 0
    }}
  ><CartesianGrid
    strokeDasharray="3 3"
    vertical={false}
    stroke="#e2e8f0"
  /><XAxis
    dataKey="day"
    axisLine={false}
    tickLine={false}
    tick={{
      fill: "#64748b",
      fontSize: 12
    }}
    dy={10}
  /><YAxis
    domain={[1, 5]}
    ticks={[1, 2, 3, 4, 5]}
    axisLine={false}
    tickLine={false}
    tick={{
      fill: "#64748b",
      fontSize: 12
    }}
    dx={-10}
  /><Tooltip
    contentStyle={{
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    }}
    formatter={(value) => [
      `Level ${value}`,
      "Mood Score"
    ]}
  /><Line
    type="monotone"
    dataKey="score"
    stroke="#6366f1"
    strokeWidth={3}
    dot={{
      r: 4,
      fill: "#6366f1",
      strokeWidth: 2,
      stroke: "#fff"
    }}
    activeDot={{
      r: 6,
      fill: "#4f46e5",
      strokeWidth: 2,
      stroke: "#fff"
    }}
  /></LineChart></ResponsiveContainer></div></CardContent></Card><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-lg shadow-indigo-200"><CardContent className="p-6"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><Sparkles className="w-5 h-5 text-white" /></div><h3 className="font-semibold text-lg">AI Recommendation</h3></div><p className="text-indigo-100 text-sm leading-relaxed mb-6">
                  Based on your recent stress levels during midterms, I suggest
                  taking a 15-minute mindful breathing break before your next
                  study session.
                </p><Button
    variant="secondary"
    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
  >
                  
                  Start Breathing Exercise
                </Button></CardContent></Card><Card className="border-indigo-100"><CardContent className="p-6"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-indigo-50 rounded-xl"><MessageSquare className="w-5 h-5 text-indigo-600" /></div><h3 className="font-semibold text-lg text-slate-800">
                    Need to talk?
                  </h3></div><p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Our AI support bot is available 24/7 for emotional support, or
                  you can book a session with a counselor.
                </p><div className="flex gap-2"><Button
    variant="primary"
    className="flex-1"
    onClick={() => navigate("/chat")}
  >
                    
                    Chat Now
                  </Button><Button
    variant="outline"
    className="flex-1"
    onClick={() => navigate("/counseling")}
  >
                    
                    Book
                  </Button></div></CardContent></Card></div></div>{
    /* Right Column - Quick Actions & Tips */
  }<div className="space-y-6"><Card><CardHeader className="pb-3"><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="space-y-2"><button
    onClick={() => navigate("/mood")}
    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
  ><div className="flex items-center gap-3"><div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors"><Smile className="w-4 h-4" /></div><span className="text-sm font-medium text-slate-700">
                    Log Daily Mood
                  </span></div><ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" /></button><button
    onClick={() => navigate("/stress")}
    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
  ><div className="flex items-center gap-3"><div className="p-2 bg-rose-50 rounded-lg text-rose-600 group-hover:bg-rose-100 transition-colors"><Activity className="w-4 h-4" /></div><span className="text-sm font-medium text-slate-700">
                    Update Stress Level
                  </span></div><ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors" /></button><button
    onClick={() => navigate("/counseling")}
    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
  ><div className="flex items-center gap-3"><div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors"><CalendarIcon className="w-4 h-4" /></div><span className="text-sm font-medium text-slate-700">
                    Book Counseling
                  </span></div><ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors" /></button></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle>Wellness Tips</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-4 items-start p-3 rounded-xl bg-blue-50/50 border border-blue-100/50"><div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0"><Brain className="w-4 h-4" /></div><div><h4 className="text-sm font-medium text-slate-800">
                    Pomodoro Technique
                  </h4><p className="text-xs text-slate-500 mt-1">
                    Study for 25 mins, break for 5 mins to reduce cognitive
                    load.
                  </p></div></div><div className="flex gap-4 items-start p-3 rounded-xl bg-teal-50/50 border border-teal-100/50"><div className="p-2 bg-teal-100 rounded-lg text-teal-600 shrink-0"><Coffee className="w-4 h-4" /></div><div><h4 className="text-sm font-medium text-slate-800">
                    Hydration Check
                  </h4><p className="text-xs text-slate-500 mt-1">
                    Remember to drink water during your long study sessions
                    today.
                  </p></div></div><div className="flex gap-4 items-start p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/50"><div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0"><Moon className="w-4 h-4" /></div><div><h4 className="text-sm font-medium text-slate-800">
                    Sleep Hygiene
                  </h4><p className="text-xs text-slate-500 mt-1">
                    Try to get 7-8 hours of sleep before your exam tomorrow.
                  </p></div></div></CardContent></Card></div></div></div>;
}
