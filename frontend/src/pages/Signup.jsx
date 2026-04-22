import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const SPECIALIZATION_OPTIONS = [
  "Clinical Psychology",
  "Academic Stress",
  "Anxiety & Stress Management",
  "Depression Support",
  "Relationship Counseling",
  "Career Guidance",
  "Trauma Support",
  "General Counseling"
];

export function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Student",
    studentId: "",
    specialization: "",

    // Counselor privacy fields
    displayName: "",
    workEmail: "",
    phone: "",
    licenseNumber: "",
    experienceYears: "",
    consultationMode: "Both",
    showFullName: "No",
    allowDirectContact: "No",
    profileVisibility: "Students can view limited profile",
    confidentialityAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (/^\d/.test(email)) return "Email cannot start with a number";
    if (!email.includes("@")) return "Email must contain @";
    if (!/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return "Enter a valid email address";
    }
    return "";
  };

  const validateField = (name, value, allData = formData) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 3) return "Full name must be at least 3 characters";
        if (!/^[A-Za-z\s]+$/.test(value)) return "Full name must contain letters only";
        return "";

      case "email":
        return validateEmail(value);

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";

      case "studentId":
        if (allData.role !== "Student") return "";
        if (!value.trim()) return "";
        if (!/^[A-Za-z]{2}\d{8}$/.test(value)) {
          return "Student ID must start with 2 letters and 8 digits (example: IT12345678)";
        }
        return "";

      case "specialization":
        if (allData.role !== "Counselor") return "";
        if (!value.trim()) return "Specialization is required";
        return "";

      case "displayName":
        if (allData.role !== "Counselor") return "";
        if (!value.trim()) return "Display name is required";
        if (value.trim().length < 3) return "Display name must be at least 3 characters";
        if (!/^[A-Za-z\s.]+$/.test(value)) {
          return "Display name can contain letters, spaces and dots only";
        }
        return "";

      case "workEmail":
        if (allData.role !== "Counselor") return "";
        if (!value.trim()) return "Work email is required";
        return validateEmail(value);

      case "phone":
        if (allData.role !== "Counselor") return "";
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be exactly 10 digits";
        return "";

      case "licenseNumber":
        if (allData.role !== "Counselor") return "";
        if (!value.trim()) return "Counselor registration number is required";
        return "";

      case "experienceYears":
        if (allData.role !== "Counselor") return "";
        if (value === "") return "Years of experience is required";
        if (!/^\d+$/.test(value)) return "Experience must be a whole number";
        if (Number(value) < 0 || Number(value) > 50) {
          return "Experience must be between 0 and 50";
        }
        return "";

      case "confidentialityAccepted":
        if (allData.role !== "Counselor") return "";
        if (!value) return "You must accept the confidentiality agreement";
        return "";

      default:
        return "";
    }
  };

  const validateAll = (data) => {
    const newErrors = {};

    Object.keys(data).forEach((key) => {
      const message = validateField(key, data[key], data);
      if (message) newErrors[key] = message;
    });

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    const updatedData = {
      ...formData,
      [name]: newValue
    };

    setFormData(updatedData);

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue, updatedData)
    }));
  };

  const handleBlur = (e) => {
    const { name, type, checked, value } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, finalValue, formData)
    }));
  };

  const inputClass = (fieldName) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
      touched[fieldName] && errors[fieldName] ? "border-rose-400" : "border-slate-300"
    }`;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const formErrors = validateAll(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setError("Please fix the validation errors before signup");
      return;
    }

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
          {error && (
            <div className="mb-4 text-sm text-rose-500 bg-rose-50 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                className={inputClass("fullName")}
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullName && errors.fullName && (
                <p className="mt-1 text-sm text-rose-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="text"
                name="email"
                className={inputClass("email")}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-rose-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                className={inputClass("password")}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-rose-500">{errors.password}</p>
              )}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Student ID (Optional)
                </label>
                <input
                  type="text"
                  name="studentId"
                  className={inputClass("studentId")}
                  value={formData.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Example: IT12345678"
                />
                {touched.studentId && errors.studentId && (
                  <p className="mt-1 text-sm text-rose-500">{errors.studentId}</p>
                )}
              </div>
            )}

            {formData.role === "Counselor" && (
              <>
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Professional Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      className={`${inputClass("specialization")} bg-white`}
                      value={formData.specialization}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select specialization</option>
                      {SPECIALIZATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {touched.specialization && errors.specialization && (
                      <p className="mt-1 text-sm text-rose-500">{errors.specialization}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Counselor Registration Number
                    </label>
                    <input
  type="text"
  name="licenseNumber"
  placeholder="Example: C0001"
  className={inputClass("licenseNumber")}
  value={formData.licenseNumber}
  onChange={(e) => {
    let value = e.target.value.toUpperCase().replace(/[^C0-9]/g, "");
    if (value.length > 0 && value[0] !== "C") return;
    if (value.length > 5) value = value.slice(0, 5);

    const updatedData = {
      ...formData,
      licenseNumber: value
    };

    setFormData(updatedData);
    setErrors((prev) => ({
      ...prev,
      licenseNumber: validateField("licenseNumber", value, updatedData)
    }));
  }}
  onBlur={handleBlur}
/>
                    {touched.licenseNumber && errors.licenseNumber && (
                      <p className="mt-1 text-sm text-rose-500">{errors.licenseNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experienceYears"
                      min="0"
                      max="50"
                      placeholder="e.g. 5"
                      className={inputClass("experienceYears")}
                      value={formData.experienceYears}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.experienceYears && errors.experienceYears && (
                      <p className="mt-1 text-sm text-rose-500">{errors.experienceYears}</p>
                    )}
                  </div>
                </div>

                <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50 space-y-4">
                  <h3 className="text-sm font-semibold text-indigo-800">
                    Privacy Settings
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Display Name / Alias
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      placeholder="Name shown to students"
                      className={inputClass("displayName")}
                      value={formData.displayName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.displayName && errors.displayName && (
                      <p className="mt-1 text-sm text-rose-500">{errors.displayName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Work Email
                    </label>
                    <input
                      type="text"
                      name="workEmail"
                      placeholder="Official/professional email"
                      className={inputClass("workEmail")}
                      value={formData.workEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.workEmail && errors.workEmail && (
                      <p className="mt-1 text-sm text-rose-500">{errors.workEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="07XXXXXXXX"
                      className={inputClass("phone")}
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-sm text-rose-500">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Consultation Mode
                    </label>
                    <select
                      name="consultationMode"
                      value={formData.consultationMode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="Online">Online</option>
                      <option value="Physical">Physical</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Show Full Name to Students
                    </label>
                    <select
                      name="showFullName"
                      value={formData.showFullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Allow Direct Student Contact
                    </label>
                    <select
                      name="allowDirectContact"
                      value={formData.allowDirectContact}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Profile Visibility
                    </label>
                    <select
                      name="profileVisibility"
                      value={formData.profileVisibility}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="Students can view limited profile">
                        Students can view limited profile
                      </option>
                      <option value="Only admin can view full profile">
                        Only admin can view full profile
                      </option>
                    </select>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="confidentialityAccepted"
                      checked={formData.confidentialityAccepted}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1"
                    />
                    <span>
                      I confirm that counseling information and student interactions
                      will be handled confidentially according to the system privacy policy.
                    </span>
                  </label>
                  {touched.confidentialityAccepted && errors.confidentialityAccepted && (
                    <p className="mt-1 text-sm text-rose-500">
                      {errors.confidentialityAccepted}
                    </p>
                  )}
                </div>
              </>
            )}

            <Button variant="primary" className="w-full py-3 mt-6">
              Review & Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}