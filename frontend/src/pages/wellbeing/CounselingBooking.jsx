import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Video, MapPin, Search } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function CounselingBooking() {
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/counselors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) setCounselors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = counselors.filter((c) => {
    if (filter !== "All" && !c.specialization?.toLowerCase().includes(filter.toLowerCase())) return false;
    if (searchQuery && !c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && !c.specialization?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate("/wellbeing")}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Book Counseling Session</h1>
          <p className="text-slate-500 mt-1">Find the right professional to support your wellbeing.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {["All", "Stress", "Anxiety", "Depression", "Relationships", "Academic"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search counselors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading real counselors...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
          No counselors found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((counselor) => (
            <Card key={counselor._id} hoverable className="flex flex-col overflow-hidden border-slate-200">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-indigo-50 flex items-center justify-center text-indigo-300">
                      {counselor.profileImage ? (
                        <img src={counselor.profileImage} alt={counselor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold uppercase">{counselor.fullName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{counselor.fullName}</h3>
                      <p className="text-sm text-indigo-600 font-medium mt-1">{counselor.specialization || "General Counseling"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{counselor.bio || "No bio provided."}</p>
                  
                  <div className="space-y-2 mb-6">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        Status: <span className="font-medium text-slate-800">{counselor.availabilityStatus || "Available"}</span>
                     </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {(counselor.counselingModes || []).includes("Online") && <Video className="w-4 h-4 text-slate-400" />}
                      {(counselor.counselingModes || []).includes("In-person") && <MapPin className="w-4 h-4 text-slate-400" />}
                      <span>{(counselor.counselingModes || []).join(" & ") || "Online"} Sessions</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                  <Button variant="primary" fullWidth onClick={() => navigate(`/wellbeing/counseling/book/${counselor._id}`)}>
                    View & Book Slots
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
