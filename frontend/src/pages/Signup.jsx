import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Student",
    studentId: "",
    specialization: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "Counselor") {
        navigate("/counselor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">Create Account</CardTitle>
          <p className="text-sm text-slate-500 mt-2">Join UniLife OS Wellbeing</p>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-sm text-rose-500 bg-rose-50 p-3 rounded">{error}</div>}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                required 
                minLength="6"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Student">Student</option>
                <option value="Counselor">Counselor</option>
              </select>
            </div>

            {formData.role === "Student" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student ID (Optional)</label>
                <input 
                  type="text" 
                  name="studentId"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>
            )}

            {formData.role === "Counselor" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <input 
                  type="text" 
                  name="specialization"
                  required
                  placeholder="e.g., Clinical Psychology, Academic Stress"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>
            )}

            <Button variant="primary" className="w-full py-3 mt-6">Review & Sign Up</Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
