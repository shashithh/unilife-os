import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { WellbeingDashboard } from "./pages/WellbeingDashboard";
import { DailyMoodLog } from "./pages/DailyMoodLog";
import { StressTracker } from "./pages/StressTracker";
import { MoodAnalytics } from "./pages/MoodAnalytics";
import { AnonymousSupportRequest } from "./pages/AnonymousSupportRequest";
import { CounselingBooking } from "./pages/CounselingBooking";
import { CounselorSlotSelection } from "./pages/CounselorSlotSelection";
import { AIRiskPrediction } from "./pages/AIRiskPrediction";
import { AIChatSupport } from "./pages/AIChatSupport";
const PlaceholderPage = ({ title }) => <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-fade-in"><h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2><p>This module is part of the broader UniLife OS platform.</p><p className="text-sm mt-4 text-indigo-500">
      Navigate to "Wellbeing Hub" to see the generated frontend.
    </p></div>;
export function App() {
  return <Router><Routes><Route element={<AppLayout />}>{
    /* Wellbeing Hub Routes */
  }<Route path="/" element={<WellbeingDashboard />} /><Route path="/mood" element={<DailyMoodLog />} /><Route path="/stress" element={<StressTracker />} /><Route path="/analytics" element={<MoodAnalytics />} /><Route path="/support" element={<AnonymousSupportRequest />} /><Route path="/counseling" element={<CounselingBooking />} /><Route
    path="/counseling/book/:id"
    element={<CounselorSlotSelection />}
  /><Route path="/risk" element={<AIRiskPrediction />} /><Route path="/chat" element={<AIChatSupport />} />{
    /* UniLife OS Shell Placeholders */
  }<Route
    path="/dashboard-placeholder"
    element={<PlaceholderPage title="Main Dashboard" />}
  /><Route
    path="/planner-placeholder"
    element={<PlaceholderPage title="Academic Planner" />}
  /><Route
    path="/collab-placeholder"
    element={<PlaceholderPage title="Group Collaboration" />}
  /><Route
    path="/budget-placeholder"
    element={<PlaceholderPage title="Budget Manager" />}
  /><Route
    path="/calendar-placeholder"
    element={<PlaceholderPage title="Calendar" />}
  /><Route
    path="/notifications-placeholder"
    element={<PlaceholderPage title="Notifications" />}
  /><Route
    path="/profile-placeholder"
    element={<PlaceholderPage title="Profile" />}
  /><Route
    path="/settings-placeholder"
    element={<PlaceholderPage title="Settings" />}
  />{
    /* Catch-all */
  }<Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></Router>;
}
