import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Video,
  MapPin,
  Sparkles,
  Clock,
  Search
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
const counselors = [
  {
    id: "c1",
    name: "Dr. Sarah Jenkins",
    specialty: "Academic Stress & Anxiety",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    bio: "Specializes in helping students manage exam anxiety and academic burnout. 10+ years experience.",
    available: "Today",
    modes: ["Online", "Physical"],
    recommended: true
  },
  {
    id: "c2",
    name: "Michael Chen, MSW",
    specialty: "Depression & Life Transitions",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
    bio: "Focuses on adjusting to university life, homesickness, and building resilience.",
    available: "Tomorrow",
    modes: ["Online"],
    recommended: false
  },
  {
    id: "c3",
    name: "Dr. Emily Rodriguez",
    specialty: "Relationships & Identity",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80",
    bio: "Provides a safe space for discussing interpersonal conflicts, identity, and personal growth.",
    available: "Next Week",
    modes: ["Online", "Physical"],
    recommended: false
  }
];
export function CounselingBooking() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  return <div className="space-y-6 animate-fade-in"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"><div><button
    onClick={() => navigate("/")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button><h1 className="text-2xl font-bold text-slate-800">
            Book Counseling Session
          </h1><p className="text-slate-500 mt-1">
            Find the right professional to support your wellbeing.
          </p></div></div>{
    /* Filters and Search */
  }<div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"><div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">{[
    "All",
    "Academic Stress",
    "Anxiety",
    "Depression",
    "Relationships"
  ].map(
    (f) => <button
      key={f}
      onClick={() => setFilter(f)}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
    >{f}</button>
  )}</div><div className="relative w-full md:w-64"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input
    type="text"
    placeholder="Search counselors..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
  /></div></div>{
    /* Counselor Grid */
  }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{counselors.map(
    (counselor) => <Card
      key={counselor.id}
      hoverable
      className="flex flex-col overflow-hidden border-slate-200"
    >{counselor.recommended && <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 flex items-center justify-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />
                AI Recommended Match
              </div>}<CardContent className="p-0 flex-1 flex flex-col"><div className="p-6 flex-1"><div className="flex items-start gap-4 mb-4"><div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm"><img
      src={counselor.image}
      alt={counselor.name}
      className="w-full h-full object-cover"
    /></div><div><h3 className="font-bold text-slate-800 text-lg leading-tight">{counselor.name}</h3><p className="text-sm text-indigo-600 font-medium mt-1">{counselor.specialty}</p><div className="flex items-center gap-1 mt-1.5 text-sm text-slate-500"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="font-medium text-slate-700">{counselor.rating}</span><span>({counselor.reviews})</span></div></div></div><p className="text-sm text-slate-600 line-clamp-3 mb-4">{counselor.bio}</p><div className="space-y-2 mb-6"><div className="flex items-center gap-2 text-sm text-slate-600"><Clock className="w-4 h-4 text-slate-400" /><span>
                      Next available:{" "}<span className="font-medium text-slate-800">{counselor.available}</span></span></div><div className="flex items-center gap-2 text-sm text-slate-600">{counselor.modes.includes("Online") && counselor.modes.includes("Physical") ? <><Video className="w-4 h-4 text-slate-400" /><MapPin className="w-4 h-4 text-slate-400 -ml-1" /></> : counselor.modes.includes("Online") ? <Video className="w-4 h-4 text-slate-400" /> : <MapPin className="w-4 h-4 text-slate-400" />}<span>{counselor.modes.join(" & ")} Sessions</span></div></div></div><div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto"><Button
      variant={counselor.recommended ? "gradient" : "primary"}
      fullWidth
      onClick={() => navigate(`/counseling/book/${counselor.id}`)}
    >
                
                  View Available Slots
                </Button></div></CardContent></Card>
  )}</div></div>;
}
