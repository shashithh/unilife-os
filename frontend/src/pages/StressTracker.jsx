import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Info,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
const stressData = [
  {
    day: "Mon",
    level: 2
  },
  {
    day: "Tue",
    level: 3
  },
  {
    day: "Wed",
    level: 4
  },
  {
    day: "Thu",
    level: 5
  },
  {
    day: "Fri",
    level: 3
  },
  {
    day: "Sat",
    level: 2
  },
  {
    day: "Sun",
    level: 1
  }
];
const getBarColor = (level) => {
  if (level <= 2) return "#10b981";
  if (level === 3) return "#f59e0b";
  return "#ef4444";
};
export function StressTracker() {
  const navigate = useNavigate();
  const [stressLevel, setStressLevel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = () => {
    if (!stressLevel) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/");
    }, 1e3);
  };
  return <div className="max-w-4xl mx-auto animate-fade-in space-y-6"><div className="flex items-center justify-between mb-4"><button
    onClick={() => navigate("/")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{
    /* Left Column - Input */
  }<div className="lg:col-span-1 space-y-6"><Card className="border-indigo-100 shadow-md"><CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 rounded-t-2xl pb-4"><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" />
                Current Stress Level
              </CardTitle></CardHeader><CardContent className="pt-6"><p className="text-sm text-slate-500 mb-6">
                Rate your current stress level from 1 (Very Low) to 5 (Very
                High).
              </p><div className="space-y-3 mb-8">{[
    {
      level: 1,
      label: "Very Low",
      desc: "Relaxed, calm",
      color: "hover:border-emerald-400 hover:bg-emerald-50 active-bg-emerald-100 active-border-emerald-500 text-emerald-700"
    },
    {
      level: 2,
      label: "Low",
      desc: "Manageable",
      color: "hover:border-teal-400 hover:bg-teal-50 active-bg-teal-100 active-border-teal-500 text-teal-700"
    },
    {
      level: 3,
      label: "Moderate",
      desc: "Feeling pressure",
      color: "hover:border-amber-400 hover:bg-amber-50 active-bg-amber-100 active-border-amber-500 text-amber-700"
    },
    {
      level: 4,
      label: "High",
      desc: "Overwhelmed",
      color: "hover:border-orange-400 hover:bg-orange-50 active-bg-orange-100 active-border-orange-500 text-orange-700"
    },
    {
      level: 5,
      label: "Very High",
      desc: "Cannot cope",
      color: "hover:border-rose-400 hover:bg-rose-50 active-bg-rose-100 active-border-rose-500 text-rose-700"
    }
  ].map((item) => {
    const isActive = stressLevel === item.level;
    const baseColor = item.color.split("-")[2];
    return <button
      key={item.level}
      onClick={() => setStressLevel(item.level)}
      className={`
                        w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 text-left
                        ${isActive ? `border-${baseColor}-500 bg-${baseColor}-50 shadow-sm scale-[1.02]` : `border-slate-100 bg-white ${item.color.split(" ")[0]} ${item.color.split(" ")[1]}`}
                      `}
    ><div className="flex items-center gap-3"><div
      className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${isActive ? `bg-${baseColor}-500 text-white` : "bg-slate-100 text-slate-500"}
                        `}
    >{item.level}</div><div><div
      className={`font-semibold text-sm ${isActive ? `text-${baseColor}-700` : "text-slate-700"}`}
    >{item.label}</div><div className="text-xs text-slate-500">{item.desc}</div></div></div></button>;
  })}</div><Button
    variant="primary"
    fullWidth
    disabled={!stressLevel || isSubmitting}
    onClick={handleSubmit}
  >{isSubmitting ? "Saving..." : "Log Stress Level"}</Button></CardContent></Card><div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800"><Info className="w-5 h-5 shrink-0 mt-0.5" /><div><h4 className="font-medium text-sm">Why track stress?</h4><p className="text-xs mt-1 opacity-80">
                Tracking helps our AI identify patterns and suggest timely
                interventions before you burn out.
              </p></div></div></div>{
    /* Right Column - Charts */
  }<div className="lg:col-span-2 space-y-6"><Card><CardHeader><CardTitle>Weekly Stress Trend</CardTitle></CardHeader><CardContent><div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart
    data={stressData}
    margin={{
      top: 10,
      right: 10,
      bottom: 20,
      left: -20
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
    domain={[0, 5]}
    ticks={[1, 2, 3, 4, 5]}
    axisLine={false}
    tickLine={false}
    tick={{
      fill: "#64748b",
      fontSize: 12
    }}
  /><Tooltip
    cursor={{
      fill: "#f1f5f9"
    }}
    contentStyle={{
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    }}
    formatter={(value) => [
      `Level ${value}`,
      "Stress Level"
    ]}
  /><Bar dataKey="level" radius={[6, 6, 0, 0]} maxBarSize={40}>{stressData.map(
    (entry, index) => <Cell
      key={`cell-${index}`}
      fill={getBarColor(entry.level)}
    />
  )}</Bar></BarChart></ResponsiveContainer></div></CardContent></Card><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100"><CardContent className="p-5"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><TrendingDown className="w-4 h-4" /></div><h3 className="font-medium text-slate-800">
                    Weekend Recovery
                  </h3></div><p className="text-sm text-slate-600">
                  Your stress levels consistently drop by 60% during weekends.
                  Good job disconnecting!
                </p></CardContent></Card><Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100"><CardContent className="p-5"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-amber-100 rounded-lg text-amber-600"><TrendingUp className="w-4 h-4" /></div><h3 className="font-medium text-slate-800">Mid-week Peak</h3></div><p className="text-sm text-slate-600">
                  Stress peaks on Thursdays. Consider moving heavy study
                  sessions to earlier in the week.
                </p></CardContent></Card></div></div></div></div>;
}
