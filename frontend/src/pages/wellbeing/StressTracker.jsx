import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Info,
  TrendingDown,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
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

const getBarColor = (level) => {
  if (level <= 2) return "#10b981";
  if (level === 3) return "#f59e0b";
  return "#ef4444";
};

const stressLevelsDef = [
  {
    level: 1,
    label: "Very Low",
    desc: "Relaxed, calm",
    color: "hover:border-emerald-400 hover:bg-emerald-50 active-bg-emerald-100 active-border-emerald-500 text-emerald-700 hover:text-emerald-800"
  },
  {
    level: 2,
    label: "Low",
    desc: "Manageable",
    color: "hover:border-teal-400 hover:bg-teal-50 active-bg-teal-100 active-border-teal-500 text-teal-700 hover:text-teal-800"
  },
  {
    level: 3,
    label: "Moderate",
    desc: "Feeling pressure",
    color: "hover:border-amber-400 hover:bg-amber-50 active-bg-amber-100 active-border-amber-500 text-amber-700 hover:text-amber-800"
  },
  {
    level: 4,
    label: "High",
    desc: "Overwhelmed",
    color: "hover:border-orange-400 hover:bg-orange-50 active-bg-orange-100 active-border-orange-500 text-orange-700 hover:text-orange-800"
  },
  {
    level: 5,
    label: "Very High",
    desc: "Cannot cope",
    color: "hover:border-rose-400 hover:bg-rose-50 active-bg-rose-100 active-border-rose-500 text-rose-700 hover:text-rose-800"
  }
];

export function StressTracker() {
  const navigate = useNavigate();
  const [stressLevel, setStressLevel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch Today's Stress
        const todayRes = await fetch("/api/stress/today", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (todayRes.ok) {
          const todayData = await todayRes.json();
          if (todayData) {
            setStressLevel(todayData.stressLevel);
          }
        }

        // Fetch History
        const historyRes = await fetch("/api/stress", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (historyRes.ok) {
          const hData = await historyRes.json();
          // Format for chart: flip from newest->oldest to oldest->newest
          const formatted = hData.reverse().map(entry => {
            const d = new Date(entry.date);
            return {
              day: d.toLocaleDateString([], { weekday: 'short' }),
              level: entry.stressLevel
            };
          });
          setHistoryData(formatted);
        }
      } catch (err) {
        console.error("Failed to load stress data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!stressLevel) return;
    setIsSubmitting(true);
    setErrorMsg("");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/stress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stressLevel })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save stress level");

      navigate("/wellbeing");
    } catch (err) {
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 animate-fade-in relative z-10">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/wellbeing")}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>
      </div>
      
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-indigo-100 shadow-md backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 rounded-t-2xl pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Current Stress Level
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500 mb-6">
                Rate your current stress level from 1 (Very Low) to 5 (Very High).
              </p>
              
              <div className="space-y-3 mb-8">
                {stressLevelsDef.map((item) => {
                  const isActive = stressLevel === item.level;
                  const baseColor = item.color.match(/hover:border-([a-z]+)-/)[1] || "slate";
                  
                  return (
                    <button
                      key={item.level}
                      onClick={() => setStressLevel(item.level)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 text-left
                        ${isActive 
                          ? `border-${baseColor}-500 bg-${baseColor}-50 shadow-sm scale-[1.02] ring-2 ring-${baseColor}-100` 
                          : `border-slate-100 bg-white hover:border-${baseColor}-200`}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                            ${isActive 
                              ? `bg-${baseColor}-500 text-white` 
                              : `bg-slate-100 text-slate-500 group-hover:bg-${baseColor}-100 group-hover:text-${baseColor}-600`}
                          `}
                        >
                          {item.level}
                        </div>
                        <div>
                          <div
                            className={`font-semibold text-sm ${isActive ? `text-${baseColor}-700` : "text-slate-700"}`}
                          >
                            {item.label}
                          </div>
                          <div className={`text-xs ${isActive ? `text-${baseColor}-600/80` : "text-slate-500"}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="primary"
                fullWidth
                disabled={!stressLevel || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Saving..." : "Log Stress Level"}
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50/90 backdrop-blur-sm border border-blue-100 rounded-xl text-blue-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Why track stress?</h4>
              <p className="text-xs mt-1 opacity-80">
                Tracking helps our AI identify patterns and suggest timely interventions before you burn out.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle>Recent Stress Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {historyData.length === 0 ? (
                <div className="h-[300px] w-full flex items-center justify-center text-slate-400">
                  No stress history available yet.
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={historyData}
                      margin={{ top: 10, right: 10, bottom: 20, left: -20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        domain={[0, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                        }}
                        formatter={(value) => [`Level ${value}`, "Stress Level"]}
                      />
                      <Bar dataKey="level" radius={[6, 6, 0, 0]} maxBarSize={40}>
                        {historyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.level)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-slate-800">Consistent Tracking</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Logging your stress levels consistently helps build a more accurate wellbeing profile.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-slate-800">Identify Peaks</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Look at your chart to see when your stress levels peak and try to minimize commitments then.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
