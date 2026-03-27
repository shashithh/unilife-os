import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Smile,
  Calendar as CalendarIcon,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
const monthlyData = [
  {
    date: "1st",
    mood: 4,
    stress: 3
  },
  {
    date: "5th",
    mood: 3,
    stress: 4
  },
  {
    date: "10th",
    mood: 5,
    stress: 2
  },
  {
    date: "15th",
    mood: 4,
    stress: 3
  },
  {
    date: "20th",
    mood: 2,
    stress: 5
  },
  {
    date: "25th",
    mood: 4,
    stress: 3
  },
  {
    date: "30th",
    mood: 5,
    stress: 2
  }
];
const heatmapData = [
  {
    day: "Mon",
    hours: [1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4]
  },
  {
    day: "Tue",
    hours: [2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5]
  },
  {
    day: "Wed",
    hours: [3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 4]
  },
  {
    day: "Thu",
    hours: [4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3]
  },
  {
    day: "Fri",
    hours: [5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2]
  },
  {
    day: "Sat",
    hours: [2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1]
  },
  {
    day: "Sun",
    hours: [1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2]
  }
];
const getHeatmapColor = (val) => {
  if (val === 1) return "bg-emerald-100";
  if (val === 2) return "bg-emerald-300";
  if (val === 3) return "bg-amber-200";
  if (val === 4) return "bg-orange-400";
  return "bg-rose-500";
};
export function MoodAnalytics() {
  const navigate = useNavigate();
  return <div className="space-y-6 animate-fade-in"><div className="flex items-center justify-between mb-4"><div><button
    onClick={() => navigate("/")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button><h1 className="text-2xl font-bold text-slate-800">
            Wellbeing Analytics
          </h1><p className="text-slate-500 mt-1">
            Track your emotional trends and stress patterns.
          </p></div><div className="flex gap-2"><Badge variant="neutral" className="px-3 py-1 text-sm">
            Last 30 Days
          </Badge></div></div>{
    /* Summary Stats */
  }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100/50"><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Smile className="w-5 h-5" /></div><div className="flex items-center text-emerald-600 text-sm font-medium"><TrendingUp className="w-4 h-4 mr-1" /> +12%
              </div></div><h3 className="text-sm font-medium text-slate-500">Average Mood</h3><div className="mt-1"><span className="text-2xl font-bold text-slate-800">3.8</span><span className="text-sm text-slate-500"> / 5</span></div></CardContent></Card><Card className="bg-gradient-to-br from-rose-50 to-white border-rose-100/50"><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-rose-100 rounded-xl text-rose-600"><Activity className="w-5 h-5" /></div><div className="flex items-center text-rose-600 text-sm font-medium"><TrendingUp className="w-4 h-4 mr-1" /> +5%
              </div></div><h3 className="text-sm font-medium text-slate-500">
              Average Stress
            </h3><div className="mt-1"><span className="text-2xl font-bold text-slate-800">2.4</span><span className="text-sm text-slate-500"> / 5</span></div></CardContent></Card><Card className="bg-gradient-to-br from-teal-50 to-white border-teal-100/50"><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-teal-100 rounded-xl text-teal-600"><CalendarIcon className="w-5 h-5" /></div><Badge variant="success">Consistent</Badge></div><h3 className="text-sm font-medium text-slate-500">
              Logging Streak
            </h3><div className="mt-1"><span className="text-2xl font-bold text-slate-800">14</span><span className="text-sm text-slate-500"> Days</span></div></CardContent></Card><Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100/50"><CardContent className="p-5"><div className="flex justify-between items-start mb-4"><div className="p-2 bg-purple-100 rounded-xl text-purple-600"><BookOpen className="w-5 h-5" /></div></div><h3 className="text-sm font-medium text-slate-500">
              Journal Entries
            </h3><div className="mt-1"><span className="text-2xl font-bold text-slate-800">8</span><span className="text-sm text-slate-500"> This Month</span></div></CardContent></Card></div>{
    /* Main Charts */
  }<div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card className="lg:col-span-2"><CardHeader><CardTitle>Mood vs. Stress Correlation</CardTitle></CardHeader><CardContent><div className="h-[300px] w-full mt-4"><ResponsiveContainer width="100%" height="100%"><AreaChart
    data={monthlyData}
    margin={{
      top: 10,
      right: 30,
      left: 0,
      bottom: 0
    }}
  ><defs><linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient><linearGradient
    id="colorStress"
    x1="0"
    y1="0"
    x2="0"
    y2="1"
  ><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient></defs><XAxis
    dataKey="date"
    axisLine={false}
    tickLine={false}
    tick={{
      fill: "#64748b"
    }}
    dy={10}
  /><YAxis
    axisLine={false}
    tickLine={false}
    tick={{
      fill: "#64748b"
    }}
    domain={[0, 5]}
  /><CartesianGrid
    strokeDasharray="3 3"
    vertical={false}
    stroke="#e2e8f0"
  /><Tooltip
    contentStyle={{
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    }}
  /><Area
    type="monotone"
    dataKey="mood"
    stroke="#6366f1"
    fillOpacity={1}
    fill="url(#colorMood)"
    strokeWidth={2}
    name="Mood Score"
  /><Area
    type="monotone"
    dataKey="stress"
    stroke="#f43f5e"
    fillOpacity={1}
    fill="url(#colorStress)"
    strokeWidth={2}
    name="Stress Level"
  /></AreaChart></ResponsiveContainer></div></CardContent></Card><Card><CardHeader><CardTitle>Stress Heatmap (Time of Day)</CardTitle></CardHeader><CardContent><div className="space-y-2 mt-4"><div className="flex text-xs text-slate-400 mb-2"><div className="w-10" /><div className="flex-1 flex justify-between px-2"><span>8AM</span><span>12PM</span><span>4PM</span><span>8PM</span></div></div>{heatmapData.map(
    (row) => <div key={row.day} className="flex items-center gap-2"><div className="w-10 text-sm font-medium text-slate-500">{row.day}</div><div className="flex-1 flex gap-1">{row.hours.map(
      (val, i) => <div
        key={i}
        className={`flex-1 h-8 rounded-md ${getHeatmapColor(val)} transition-colors hover:opacity-80 cursor-pointer`}
        title={`Stress Level: ${val}`}
      />
    )}</div></div>
  )}<div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500"><span>Low Stress</span><div className="flex gap-1"><div className="w-3 h-3 rounded-sm bg-emerald-100" /><div className="w-3 h-3 rounded-sm bg-emerald-300" /><div className="w-3 h-3 rounded-sm bg-amber-200" /><div className="w-3 h-3 rounded-sm bg-orange-400" /><div className="w-3 h-3 rounded-sm bg-rose-500" /></div><span>High Stress</span></div></div></CardContent></Card><Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-lg shadow-indigo-200"><CardHeader><CardTitle className="text-white">AI Journal Insights</CardTitle></CardHeader><CardContent><div className="space-y-4"><p className="text-indigo-100 text-sm leading-relaxed">
                Based on your recent journal entries, we've identified some
                recurring themes in your emotional wellbeing.
              </p><div className="space-y-3"><div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20"><div className="flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-emerald-300" /><span className="font-medium text-sm">
                      Positive Triggers
                    </span></div><p className="text-xs text-indigo-100">
                    "Finishing assignments early" and "Group study sessions"
                    frequently correlate with your highest mood days.
                  </p></div><div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-rose-300" /><span className="font-medium text-sm">Stress Triggers</span></div><p className="text-xs text-indigo-100">
                    "Upcoming deadlines" and "Lack of sleep" are mentioned in
                    80% of your high-stress logs.
                  </p></div></div></div></CardContent></Card></div></div>;
}
