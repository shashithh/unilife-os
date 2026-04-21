import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Video, MapPin, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";

export function CounselorSlotSelection() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [counselor, setCounselor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionMode, setSessionMode] = useState("Online");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchCounselorData();
  }, [id]);

  const fetchCounselorData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      
      const [counselorRes, slotsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/counselors/${id}`, { headers }),
        fetch(`http://localhost:5000/api/counselors/${id}/slots`, { headers })
      ]);
      
      if (counselorRes.ok && slotsRes.ok) {
        const cData = await counselorRes.json();
        const sData = await slotsRes.json();
        
        setCounselor(cData);
        
        // Group slots by date
        const grouped = sData.slots.reduce((acc, slot) => {
          if (!acc[slot.date]) acc[slot.date] = [];
          acc[slot.date].push(slot.time);
          return acc;
        }, {});
        
        const formattedDates = Object.keys(grouped).map(date => ({
          date,
          slots: grouped[date]
        }));
        
        setAvailableSlots(formattedDates);
        if (formattedDates.length > 0) setSelectedDate(formattedDates[0].date);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          counselorId: id,
          date: selectedDate,
          timeSlot: selectedSlot,
          sessionMode,
          reason,
          urgency
        })
      });
      
      if (res.ok) setIsSuccess(true);
      else throw new Error("Booking failed");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Loading slots...</div>;
  }

  if (!counselor) {
    return <div className="text-center py-12 text-slate-500">Counselor not found.</div>;
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12 animate-fade-in">
        <Card className="text-center py-12 border-indigo-100 shadow-lg">
          <CardContent className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500 mb-8 max-w-md">
              Your session with {counselor.fullName} has been scheduled.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 w-full max-w-sm text-left mb-8">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xl">
                  {counselor.profileImage ? <img src={counselor.profileImage} alt="" className="w-full h-full object-cover" /> : counselor.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{counselor.fullName}</p>
                  <p className="text-xs text-slate-500">{counselor.specialization || "General Counseling"}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <CalendarIcon className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">{selectedSlot}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  {sessionMode === "Online" ? <Video className="w-4 h-4 text-indigo-500" /> : <MapPin className="w-4 h-4 text-indigo-500" />}
                  <span className="font-medium">{sessionMode} Session</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/wellbeing")}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <button onClick={() => navigate("/counseling")} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Counselors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-indigo-50/50 border-indigo-100">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-500">
                {counselor.profileImage ? <img src={counselor.profileImage} alt="" className="w-full h-full object-cover" /> : counselor.fullName.charAt(0)}
              </div>
              <h2 className="font-bold text-xl text-slate-800">{counselor.fullName}</h2>
              <p className="text-sm text-indigo-600 font-medium mt-1">{counselor.specialization || "General Counseling"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Session Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {(counselor.counselingModes || ["Online", "In-person"]).includes("Online") && (
                    <button type="button" onClick={() => setSessionMode("Online")} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${sessionMode === "Online" ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500" : "bg-white border-slate-200 text-slate-600"}`}>
                      <Video className="w-4 h-4" /> Online
                    </button>
                  )}
                  {(counselor.counselingModes || ["Online", "In-person"]).includes("In-person") && (
                    <button type="button" onClick={() => setSessionMode("In-person")} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${sessionMode === "In-person" ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500" : "bg-white border-slate-200 text-slate-600"}`}>
                      <MapPin className="w-4 h-4" /> Physical
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Urgency Level</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value="Normal">Normal (Routine check-in)</option>
                  <option value="High">High (Need to talk soon)</option>
                  <option value="Critical">Critical (Crisis support)</option>
                </select>
              </div>

              <Textarea
                label="Reason for visit (Optional)"
                placeholder="Briefly describe what you'd like to discuss..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Select a Time Slot</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col">
              {availableSlots.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No available slots. Please try another counselor.</div>
              ) : (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-100">
                    {availableSlots.map((day) => (
                      <button
                        key={day.date}
                        onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }}
                        className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all ${selectedDate === day.date ? "bg-slate-800 text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
                      >
                        <div className="font-bold">{day.date}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Available times</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSlots.find(d => d.date === selectedDate)?.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === slot ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20 shadow-sm" : "bg-white border-slate-200 text-slate-700"}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        {selectedSlot ? <span>Selected: <strong className="text-slate-800">{selectedDate} at {selectedSlot}</strong></span> : <span>Please select a time slot</span>}
                      </div>
                      <Button variant="primary" size="lg" disabled={!selectedSlot || isSubmitting} onClick={handleSubmit} className="min-w-[150px]">
                        {isSubmitting ? "Confirming..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
