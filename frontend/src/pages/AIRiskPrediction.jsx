import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Brain,
  ShieldAlert,
  ArrowRight,
  Activity,
  BookOpen
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
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
const riskTrendData = [
  {
    week: "W1",
    riskScore: 20
  },
  {
    week: "W2",
    riskScore: 25
  },
  {
    week: "W3",
    riskScore: 40
  },
  {
    week: "W4",
    riskScore: 65
  },
  {
    week: "W5",
    riskScore: 85
  }
  // Current week
];
export function AIRiskPrediction() {
  const navigate = useNavigate();
  const riskLevel = "High";
  const riskScore = 85;
  return <div className="space-y-6 animate-fade-in"><div className="flex items-center justify-between mb-4"><div><button
    onClick={() => navigate("/")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button><h1 className="text-2xl font-bold text-slate-800">
            AI Risk Analysis
          </h1><p className="text-slate-500 mt-1">
            Predictive insights based on your recent activity and wellbeing
            data.
          </p></div></div>{
    /* Main Risk Banner */
  }<div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-rose-200 relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" /><div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"><div className="flex items-start gap-5"><div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0"><AlertTriangle className="w-8 h-8 text-white" /></div><div><div className="flex items-center gap-3 mb-1"><h2 className="text-3xl font-bold">High Risk Detected</h2><Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Score: {riskScore}/100
                </Badge></div><p className="text-rose-100 max-w-xl text-sm md:text-base leading-relaxed">
                Our AI has detected a significant increase in your stress levels
                combined with a prolonged negative mood trend over the past 5
                days.
              </p></div></div><div className="shrink-0 w-full md:w-auto"><Button
    variant="secondary"
    className="w-full md:w-auto bg-white text-rose-600 hover:bg-rose-50 border-0 shadow-md"
    onClick={() => navigate("/counseling")}
  >
              
              Book Counseling Now
            </Button></div></div></div>{
    /* Anonymous Alert Notice */
  }<div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800"><ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" /><div><h4 className="font-semibold text-sm">
            Anonymous Early Warning Triggered
          </h4><p className="text-sm mt-1 opacity-90">
            Because your risk level is high, an anonymous alert (Case ID: #8924)
            has been generated for the Student Affairs team.
            <strong> Your identity remains completely hidden.</strong> They only
            see the risk pattern, not who you are.
          </p></div></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{
    /* Left Column - Analysis Factors */
  }<div className="lg:col-span-1 space-y-4"><h3 className="font-semibold text-slate-800 text-lg mb-2">
            Analysis Factors
          </h3><Card className="border-rose-200 bg-rose-50/30"><CardContent className="p-4 flex items-start gap-4"><div className="p-2 bg-rose-100 rounded-lg text-rose-600 shrink-0"><Activity className="w-5 h-5" /></div><div><h4 className="font-medium text-slate-800 text-sm">
                  Stress Trend
                </h4><p className="text-xs text-slate-600 mt-1">
                  Stress level ≥ 4 reported for 3 consecutive days.
                </p><div className="mt-2 w-full bg-slate-200 rounded-full h-1.5"><div className="bg-rose-500 h-1.5 rounded-full w-[90%]" /></div></div></CardContent></Card><Card className="border-orange-200 bg-orange-50/30"><CardContent className="p-4 flex items-start gap-4"><div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0"><Brain className="w-5 h-5" /></div><div><h4 className="font-medium text-slate-800 text-sm">
                  Mood Pattern
                </h4><p className="text-xs text-slate-600 mt-1">
                  "Sad" or "Overwhelmed" logged for 5 out of the last 7 days.
                </p><div className="mt-2 w-full bg-slate-200 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full w-[80%]" /></div></div></CardContent></Card><Card className="border-amber-200 bg-amber-50/30"><CardContent className="p-4 flex items-start gap-4"><div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0"><Calendar className="w-5 h-5" /></div><div><h4 className="font-medium text-slate-800 text-sm">
                  Academic Pressure
                </h4><p className="text-xs text-slate-600 mt-1">
                  3 major assignments due within the next 48 hours.
                </p><div className="mt-2 w-full bg-slate-200 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full w-[75%]" /></div></div></CardContent></Card><Card className="border-slate-200 bg-slate-50/50 opacity-70"><CardContent className="p-4 flex items-start gap-4"><div className="p-2 bg-slate-200 rounded-lg text-slate-500 shrink-0"><BookOpen className="w-5 h-5" /></div><div><h4 className="font-medium text-slate-800 text-sm">
                  Attendance (Placeholder)
                </h4><p className="text-xs text-slate-500 mt-1">
                  Integration with attendance system pending.
                </p></div></CardContent></Card></div>{
    /* Right Column - Trend Chart & Recommendations */
  }<div className="lg:col-span-2 space-y-6"><Card><CardHeader><CardTitle>Risk Score Trend (Last 5 Weeks)</CardTitle></CardHeader><CardContent><div className="h-[250px] w-full mt-2"><ResponsiveContainer width="100%" height="100%"><LineChart
    data={riskTrendData}
    margin={{
      top: 10,
      right: 10,
      bottom: 0,
      left: -20
    }}
  ><CartesianGrid
    strokeDasharray="3 3"
    vertical={false}
    stroke="#e2e8f0"
  /><XAxis
    dataKey="week"
    axisLine={false}
    tickLine={false}
    tick={{
      fill: "#64748b",
      fontSize: 12
    }}
    dy={10}
  /><YAxis
    domain={[0, 100]}
    axisLine={false}
    tickLine={false}
    tick={{
      fill: "#64748b",
      fontSize: 12
    }}
  /><Tooltip
    contentStyle={{
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    }}
    formatter={(value) => [
      `${value}/100`,
      "Risk Score"
    ]}
  /><ReferenceLine
    y={70}
    stroke="#ef4444"
    strokeDasharray="3 3"
    label={{
      position: "insideTopLeft",
      value: "High Risk Threshold",
      fill: "#ef4444",
      fontSize: 12
    }}
  /><ReferenceLine
    y={40}
    stroke="#f59e0b"
    strokeDasharray="3 3"
    label={{
      position: "insideTopLeft",
      value: "Moderate Risk Threshold",
      fill: "#f59e0b",
      fontSize: 12
    }}
  /><Line
    type="monotone"
    dataKey="riskScore"
    stroke="#ef4444"
    strokeWidth={3}
    dot={{
      r: 4,
      fill: "#ef4444",
      strokeWidth: 2,
      stroke: "#fff"
    }}
    activeDot={{
      r: 6,
      fill: "#dc2626",
      strokeWidth: 2,
      stroke: "#fff"
    }}
  /></LineChart></ResponsiveContainer></div></CardContent></Card><Card className="border-indigo-100"><CardHeader className="pb-2"><CardTitle>Recommended Next Actions</CardTitle></CardHeader><CardContent className="space-y-3"><div
    className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors group cursor-pointer"
    onClick={() => navigate("/counseling")}
  ><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    1
                  </div><div><h4 className="font-semibold text-slate-800 text-sm">
                      Schedule a Counseling Session
                    </h4><p className="text-xs text-slate-500 mt-0.5">
                      Professional support is highly recommended right now.
                    </p></div></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" /></div><div
    className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-purple-200 transition-colors group cursor-pointer"
    onClick={() => navigate("/chat")}
  ><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                    2
                  </div><div><h4 className="font-semibold text-slate-800 text-sm">
                      Talk to AI Support Bot
                    </h4><p className="text-xs text-slate-500 mt-0.5">
                      Get immediate emotional support and coping strategies.
                    </p></div></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" /></div><div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-teal-200 transition-colors group cursor-pointer"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition-colors">
                    3
                  </div><div><h4 className="font-semibold text-slate-800 text-sm">
                      Request Academic Extension
                    </h4><p className="text-xs text-slate-500 mt-0.5">
                      Use your wellbeing status to request deadline extensions.
                    </p></div></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" /></div></CardContent></Card></div></div></div>;
}
