import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Info,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
const counselor = {
  id: "c1",
  name: "Dr. Sarah Jenkins",
  specialty: "Academic Stress & Anxiety",
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
};
const availableDates = [
  {
    date: "Today, Oct 24",
    slots: ["2:00 PM", "3:30 PM", "4:00 PM"]
  },
  {
    date: "Tomorrow, Oct 25",
    slots: ["9:00 AM", "11:30 AM", "1:00 PM", "4:30 PM"]
  },
  {
    date: "Friday, Oct 26",
    slots: ["10:00 AM", "2:00 PM"]
  }
];
export function CounselorSlotSelection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(availableDates[0].date);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionMode, setSessionMode] = useState(
    "online"
  );
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };
  if (isSuccess) {
    return <div className="max-w-2xl mx-auto mt-12 animate-fade-in"><Card className="text-center py-12 border-indigo-100 shadow-lg"><CardContent className="flex flex-col items-center"><div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div><h2 className="text-2xl font-bold text-slate-800 mb-2">
              Booking Confirmed!
            </h2><p className="text-slate-500 mb-8 max-w-md">
              Your session with {counselor.name} has been scheduled. A
              confirmation email has been sent to your student address.
            </p><div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 w-full max-w-sm text-left mb-8"><div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200"><img
      src={counselor.image}
      alt={counselor.name}
      className="w-12 h-12 rounded-full object-cover"
    /><div><p className="font-bold text-slate-800">{counselor.name}</p><p className="text-xs text-slate-500">{counselor.specialty}</p></div></div><div className="space-y-3 text-sm"><div className="flex items-center gap-2 text-slate-700"><CalendarIcon className="w-4 h-4 text-indigo-500" /><span className="font-medium">{selectedDate}</span></div><div className="flex items-center gap-2 text-slate-700"><Clock className="w-4 h-4 text-indigo-500" /><span className="font-medium">{selectedSlot} (45 mins)</span></div><div className="flex items-center gap-2 text-slate-700">{sessionMode === "online" ? <Video className="w-4 h-4 text-indigo-500" /> : <MapPin className="w-4 h-4 text-indigo-500" />}<span className="font-medium">{sessionMode === "online" ? "Google Meet Link (via Email)" : "Student Center, Room 302"}</span></div></div></div><div className="flex gap-3"><Button variant="outline" onClick={() => navigate("/")}>
                Back to Dashboard
              </Button><Button
      variant="primary"
      onClick={() => navigate("/calendar-placeholder")}
    >
                
                Add to Calendar
              </Button></div></CardContent></Card></div>;
  }
  return <div className="max-w-4xl mx-auto animate-fade-in space-y-6"><button
    onClick={() => navigate("/counseling")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Counselors
      </button><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{
    /* Left Column - Counselor Info & Form */
  }<div className="lg:col-span-1 space-y-6"><Card className="bg-indigo-50/50 border-indigo-100"><CardContent className="p-6 text-center"><div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md mb-4"><img
    src={counselor.image}
    alt={counselor.name}
    className="w-full h-full object-cover"
  /></div><h2 className="font-bold text-xl text-slate-800">{counselor.name}</h2><p className="text-sm text-indigo-600 font-medium mt-1">{counselor.specialty}</p></CardContent></Card><Card><CardHeader className="pb-3 border-b border-slate-100"><CardTitle className="text-base">Session Details</CardTitle></CardHeader><CardContent className="pt-4 space-y-5"><div className="space-y-2"><label className="text-sm font-medium text-slate-700">
                  Session Mode
                </label><div className="grid grid-cols-2 gap-2"><button
    type="button"
    onClick={() => setSessionMode("online")}
    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${sessionMode === "online" ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
  ><Video className="w-4 h-4" /> Online
                  </button><button
    type="button"
    onClick={() => setSessionMode("physical")}
    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${sessionMode === "physical" ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
  ><MapPin className="w-4 h-4" /> Physical
                  </button></div></div><div className="space-y-2"><label className="text-sm font-medium text-slate-700">
                  Urgency Level
                </label><select
    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
    value={urgency}
    onChange={(e) => setUrgency(e.target.value)}
  ><option value="normal">Normal (Routine check-in)</option><option value="high">High (Need to talk soon)</option><option value="urgent">Urgent (Crisis support)</option></select></div><Textarea
    label="Reason for visit (Optional)"
    placeholder="Briefly describe what you'd like to discuss..."
    value={reason}
    onChange={(e) => setReason(e.target.value)}
    className="min-h-[100px]"
  /></CardContent></Card></div>{
    /* Right Column - Time Selection */
  }<div className="lg:col-span-2 space-y-6"><Card className="h-full flex flex-col"><CardHeader className="border-b border-slate-100"><CardTitle>Select a Time Slot</CardTitle></CardHeader><CardContent className="pt-6 flex-1 flex flex-col">{
    /* Date Tabs */
  }<div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-100">{availableDates.map(
    (day) => <button
      key={day.date}
      onClick={() => {
        setSelectedDate(day.date);
        setSelectedSlot(null);
      }}
      className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all ${selectedDate === day.date ? "bg-slate-800 text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
    ><div className="text-xs font-medium opacity-80 mb-1">{day.date.split(",")[0]}</div><div className="font-bold">{day.date.split(",")[1]}</div></button>
  )}</div>{
    /* Time Slots Grid */
  }<div className="mb-8"><h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Available times
                  for {selectedDate}</h4><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{availableDates.find((d) => d.date === selectedDate)?.slots.map(
    (slot) => <button
      key={slot}
      onClick={() => setSelectedSlot(slot)}
      className={`py-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === slot ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20 shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30"}`}
    >{slot}</button>
  )}</div></div>{
    /* Footer Actions */
  }<div className="mt-auto pt-6 border-t border-slate-100"><div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6"><Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" /><div className="text-sm text-amber-800"><p className="font-semibold mb-1">Cancellation Policy</p><p>
                      Cancellations or rescheduling must be done at least 12
                      hours before your scheduled session time.
                    </p></div></div><div className="flex items-center justify-between"><div className="text-sm text-slate-500">{selectedSlot ? <span>
                        Selected:{" "}<strong className="text-slate-800">{selectedDate} at {selectedSlot}</strong></span> : <span>Please select a time slot to continue</span>}</div><Button
    variant="gradient"
    size="lg"
    disabled={!selectedSlot || isSubmitting}
    onClick={handleSubmit}
    className="min-w-[150px]"
  >{isSubmitting ? "Confirming..." : "Confirm Booking"}</Button></div></div></CardContent></Card></div></div></div>;
}
