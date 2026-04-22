import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Calendar, User as UserIcon, CheckCircle, Clock } from "lucide-react";

export function CounselorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings/counselor", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setBookings(bookings.map((b) => (b._id === id ? { ...b, status } : b)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pending = bookings.filter((b) => b.status === "Pending");
  const upcoming = bookings.filter((b) => b.status === "Confirmed");

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Counselor Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, {user.fullName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Sessions</p>
                <div className="text-3xl font-bold text-slate-800 mt-1">{bookings.length}</div>
              </div>
              <div className="p-3 bg-indigo-100/50 rounded-xl text-indigo-600"><Calendar className="w-6 h-6" /></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-50 to-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming</p>
                <div className="text-3xl font-bold text-slate-800 mt-1">{upcoming.length}</div>
              </div>
              <div className="p-3 bg-teal-100/50 rounded-xl text-teal-600"><CheckCircle className="w-6 h-6" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                <div className="text-3xl font-bold text-slate-800 mt-1">{pending.length}</div>
              </div>
              <div className="p-3 bg-rose-100/50 rounded-xl text-rose-600"><Clock className="w-6 h-6" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.length === 0 ? (
              <p className="text-slate-500 text-sm">No pending appointments.</p>
            ) : (
              pending.map((b) => (
                <div key={b._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800">{b.student.fullName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{b.date} • {b.timeSlot} ({b.sessionMode})</p>
                    </div>
                    <Badge variant="warning">{b.status}</Badge>
                  </div>
                  {b.reason && <p className="text-sm border-t border-slate-200 mt-2 pt-2 text-slate-600"><strong>Reason:</strong> {b.reason}</p>}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => handleStatusUpdate(b._id, "Confirmed")}>Confirm</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(b._id, "Cancelled")}>Decline</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-slate-500 text-sm">No upcoming appointments.</p>
            ) : (
              upcoming.map((b) => (
                <div key={b._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800">{b.student.fullName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{b.date} • {b.timeSlot} ({b.sessionMode})</p>
                    </div>
                    <Badge variant="success">{b.status}</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => handleStatusUpdate(b._id, "Completed")}>Mark Completed</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(b._id, "Cancelled")}>Cancel</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
