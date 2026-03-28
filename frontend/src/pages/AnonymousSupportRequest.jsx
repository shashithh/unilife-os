import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Badge } from "../components/ui/Badge";
export function AnonymousSupportRequest() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [caseId, setCaseId] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setCaseId(`CASE-${Math.floor(1e3 + Math.random() * 9e3)}`);
    }, 1500);
  };
  if (isSuccess) {
    return <div className="max-w-2xl mx-auto mt-12 animate-fade-in"><Card className="text-center py-12 border-indigo-100 bg-indigo-50/30"><CardContent className="flex flex-col items-center"><div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="w-8 h-8 text-indigo-600" /></div><h2 className="text-2xl font-bold text-slate-800 mb-2">
              Request Submitted Anonymously
            </h2><p className="text-slate-500 mb-6 max-w-md">
              Your message has been securely sent to the Student Affairs team.
              Your identity remains hidden.
            </p><div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 w-full max-w-sm"><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Your Anonymous Case ID
              </p><p className="text-2xl font-mono font-bold text-indigo-600 tracking-widest">{caseId}</p><p className="text-xs text-slate-400 mt-2">
                Save this ID if you wish to follow up on this specific request
                later.
              </p></div><Button variant="outline" onClick={() => navigate("/")}>
              Return to Dashboard
            </Button></CardContent></Card></div>;
  }
  return <div className="max-w-2xl mx-auto animate-fade-in space-y-6"><button
    onClick={() => navigate("/")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button><div className="flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl"><div className="p-3 bg-white rounded-xl shadow-sm shrink-0"><Lock className="w-6 h-6 text-indigo-600" /></div><div><div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-slate-800 text-lg">
              Privacy-First Support
            </h3><Badge variant="purple">100% Anonymous</Badge></div><p className="text-sm text-slate-600 leading-relaxed">
            Your identity is completely hidden. Admins and counselors will only
            see a randomly generated Case ID. Use this form if you need help but
            aren't ready to reveal who you are.
          </p></div></div><Card className="border-rose-100 shadow-md"><CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-rose-500" />
            Submit Anonymous Request
          </CardTitle></CardHeader><CardContent className="pt-6"><form onSubmit={handleSubmit} className="space-y-6"><div className="space-y-1.5"><label className="text-sm font-medium text-slate-700">
                Topic / Category
              </label><select
    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
    value={topic}
    onChange={(e) => setTopic(e.target.value)}
    required
  ><option value="" disabled>
                  Select a category...
                </option><option value="academic">Academic Pressure / Overwhelm</option><option value="mental">Mental Health Concern</option><option value="bullying">Bullying / Harassment</option><option value="financial">Financial Stress</option><option value="other">Other</option></select></div><Textarea
    label="How can we help you?"
    placeholder="Describe what you're going through. Please do not include your name or student ID if you wish to remain anonymous."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    required
    className="min-h-[150px]"
    helperText="Minimum 20 characters required."
  /><div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" /><div className="text-sm text-rose-800"><p className="font-semibold mb-1">Immediate Danger?</p><p>
                  If you or someone else is in immediate physical danger, please
                  contact emergency services (911) or campus security directly.
                  This form is not monitored 24/7.
                </p></div></div><Button
    type="submit"
    variant="primary"
    fullWidth
    size="lg"
    disabled={!topic || message.length < 20 || isSubmitting}
    className="bg-slate-800 hover:bg-slate-900 focus:ring-slate-800"
  >{isSubmitting ? "Encrypting & Sending..." : "Submit Anonymously"}</Button></form></CardContent></Card></div>;
}
