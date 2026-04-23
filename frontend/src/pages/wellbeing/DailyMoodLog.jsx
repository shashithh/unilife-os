import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Info, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";

const moods = [
  {
    id: "happy",
    emoji: "😄",
    label: "Happy",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
  },
  {
    id: "calm",
    emoji: "😌",
    label: "Calm",
    color: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200"
  },
  {
    id: "neutral",
    emoji: "😐",
    label: "Neutral",
    color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
  },
  {
    id: "stressed",
    emoji: "😰",
    label: "Stressed",
    color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
  },
  {
    id: "sad",
    emoji: "😢",
    label: "Sad",
    color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
  },
  {
    id: "overwhelmed",
    emoji: "😫",
    label: "Overwhelmed",
    color: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200"
  }
];

export function DailyMoodLog() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const todayRes = await fetch("/api/moods/today", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (todayRes.ok) {
          const todayData = await todayRes.json();
          if (todayData) {
            setSelectedMood(todayData.mood);
            setNote((todayData.note || "").slice(0, 50));
          }
        }

        const historyRes = await fetch("/api/moods", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData);
        }
      } catch (err) {
        console.error("Failed to load mood data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNoteChange = (e) => {
    const value = e.target.value.slice(0, 50);
    setNote(value);

    if (value.length > 50) {
      setNoteError("Note must be 50 characters or less");
    } else {
      setNoteError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMood) return;

    if (note.length > 50) {
      setNoteError("Note must be 50 characters or less");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setNoteError("");

    const token = localStorage.getItem("token");

    const payload = { mood: selectedMood, note };
    console.log("[DEBUG Frontend] Sending payload to /api/moods:", payload);
    console.log("[DEBUG Frontend] Token present in headers:", !!token);

    try {
      const res = await fetch("/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("[DEBUG Frontend] Response from backend:", res.status, data);

      if (!res.ok) throw new Error(data.error || "Failed to save mood");

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/wellbeing");
      }, 2000);
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

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-12 animate-fade-in relative z-10">
        <Card className="text-center py-12 border-emerald-100 bg-emerald-50/30">
          <CardContent className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Mood Logged!</h2>
            <p className="text-slate-500 mb-6">Your daily mood has been recorded successfully.</p>
            <Button variant="outline" onClick={() => navigate("/wellbeing")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6 relative z-10">
      <button
        onClick={() => navigate("/wellbeing")}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 opacity-90 backdrop-blur-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-sm">Daily Check-in</h4>
          <p className="text-xs mt-1 opacity-80">
            You can only log your primary mood once per day. If you submit multiple times, your latest entry for the day will be kept.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          {errorMsg}
        </div>
      )}

      <Card className="backdrop-blur-sm bg-white/90">
        <CardHeader>
          <CardTitle className="text-xl">How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200
                    ${selectedMood === mood.id
                      ? `${mood.color} ring-4 ring-opacity-30 ring-offset-2 ring-${mood.color.split("-")[1]}-500 scale-105`
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600"
                    }
                  `}
                >
                  <span className="text-4xl mb-2">{mood.emoji}</span>
                  <span className="font-medium text-sm">{mood.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                label="Journal Note (Optional)"
                placeholder="What's making you feel this way? Add a private note..."
                value={note}
                onChange={handleNoteChange}
                className="bg-white"
              />
              <div className="flex justify-between items-center">
                {noteError ? (
                  <p className="text-xs text-rose-500">{noteError}</p>
                ) : (
                  <p className="text-xs text-slate-400">Your notes are private and encrypted.</p>
                )}
                <p className="text-xs text-slate-400">{note.length}/50</p>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={!selectedMood || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Daily Mood"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="pt-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-1">
          Recent Entries
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 px-1">No recorded entries yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => {
              const moodDef = moods.find((m) => m.id === entry.mood) || moods[2];
              const dateStr = new Date(entry.date).toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric"
              });
              return (
                <div
                  key={entry._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl shrink-0">
                    {moodDef.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{moodDef.label}</span>
                      <span className="text-xs text-slate-400">• {dateStr}</span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{entry.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}