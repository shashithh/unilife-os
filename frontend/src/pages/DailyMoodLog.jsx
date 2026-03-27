import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Info, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
const moods = [
  {
    id: "happy",
    emoji: "\u{1F604}",
    label: "Happy",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
  },
  {
    id: "calm",
    emoji: "\u{1F60C}",
    label: "Calm",
    color: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200"
  },
  {
    id: "neutral",
    emoji: "\u{1F610}",
    label: "Neutral",
    color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
  },
  {
    id: "stressed",
    emoji: "\u{1F630}",
    label: "Stressed",
    color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
  },
  {
    id: "sad",
    emoji: "\u{1F622}",
    label: "Sad",
    color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
  },
  {
    id: "overwhelmed",
    emoji: "\u{1F62B}",
    label: "Overwhelmed",
    color: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200"
  }
];
export function DailyMoodLog() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2e3);
    }, 1e3);
  };
  if (isSuccess) {
    return <div className="max-w-md mx-auto mt-12 animate-fade-in"><Card className="text-center py-12 border-emerald-100 bg-emerald-50/30"><CardContent className="flex flex-col items-center"><div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div><h2 className="text-2xl font-bold text-slate-800 mb-2">
              Mood Logged!
            </h2><p className="text-slate-500 mb-6">
              Your daily mood has been recorded successfully.
            </p><Button variant="outline" onClick={() => navigate("/")}>
              Return to Dashboard
            </Button></CardContent></Card></div>;
  }
  return <div className="max-w-2xl mx-auto animate-fade-in space-y-6"><button
    onClick={() => navigate("/")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button><div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800"><Info className="w-5 h-5 shrink-0 mt-0.5" /><div><h4 className="font-medium text-sm">Daily Check-in</h4><p className="text-xs mt-1 opacity-80">
            You can only log your primary mood once per day. This helps build an
            accurate emotional trend over time.
          </p></div></div><Card><CardHeader><CardTitle className="text-xl">How are you feeling today?</CardTitle></CardHeader><CardContent><form onSubmit={handleSubmit} className="space-y-8"><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{moods.map(
    (mood) => <button
      key={mood.id}
      type="button"
      onClick={() => setSelectedMood(mood.id)}
      className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200
                    ${selectedMood === mood.id ? `${mood.color} ring-4 ring-opacity-30 ring-offset-2 ring-${mood.color.split("-")[1]}-500 scale-105` : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600"}
                  `}
    ><span className="text-4xl mb-2">{mood.emoji}</span><span className="font-medium text-sm">{mood.label}</span></button>
  )}</div><div className="space-y-2"><Textarea
    label="Journal Note (Optional)"
    placeholder="What's making you feel this way? Add a private note..."
    value={note}
    onChange={(e) => setNote(e.target.value)}
    className="bg-white"
  /><p className="text-xs text-slate-400 text-right">
                Your notes are private and encrypted.
              </p></div><Button
    type="submit"
    variant="gradient"
    fullWidth
    size="lg"
    disabled={!selectedMood || isSubmitting}
  >{isSubmitting ? "Saving..." : "Save Daily Mood"}</Button></form></CardContent></Card><div className="pt-4"><h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-1">
          Recent Entries
        </h3><div className="space-y-3">{[
    {
      day: "Yesterday",
      mood: "Calm",
      emoji: "\u{1F60C}",
      note: "Finished my assignment early."
    },
    {
      day: "Tuesday",
      mood: "Stressed",
      emoji: "\u{1F630}",
      note: "Too many deadlines approaching."
    }
  ].map(
    (entry, i) => <div
      key={i}
      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
    ><div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl shrink-0">{entry.emoji}</div><div><div className="flex items-center gap-2"><span className="font-medium text-slate-800">{entry.mood}</span><span className="text-xs text-slate-400">• {entry.day}</span></div><p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{entry.note}</p></div></div>
  )}</div></div></div>;
}
