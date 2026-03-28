import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PlannerNav } from "../../components/planner/PlannerNav";
import {
  BrainCircuit,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export function AIScheduler() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-purple-600" />
          AI Study Scheduler
        </h1>
        <p className="text-gray-600">
          Let the system analyze your deadlines, priority, and free time to
          generate the perfect plan.
        </p>
      </div>

      <PlannerNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-gradient-to-b from-purple-50 to-white border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Smart Analysis
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              The AI checks your past completion rate, upcoming deadlines, and
              task priorities to suggest the most efficient study schedule.
            </p>

            <Button
              variant="primary"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              icon={
                isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <BrainCircuit className="w-4 h-4" />
                )
              }
            >
              {isAnalyzing ? "Analyzing Workload..." : "Run AI Analysis"}
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Factors Considered</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Deadline Proximity
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Task Priority Level
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Historical Completion Rate
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Available Free Time
              </li>
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isAnalyzing ? (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Processing your schedule...
              </h3>
              <p className="text-gray-500 max-w-md">
                Calculating optimal study blocks, predicting deadline risks, and
                auto-rescheduling missed tasks.
              </p>
            </Card>
          ) : hasAnalyzed ? (
            <div className="space-y-6 animate-slide-up">
              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Analysis Complete
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your schedule has been optimized for maximum productivity.
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Productivity Score: +12%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">
                      Completed Tasks
                    </p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">
                      Pending Tasks
                    </p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  AI Recommendations
                </h3>

                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl flex gap-4">
                    <Calendar className="w-6 h-6 text-blue-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Weekly Plan Generated
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        A new study plan has been created based on your highest
                        priorities.
                      </p>

                      <div className="flex gap-3 flex-wrap">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate("/weekly-plan")}
                        >
                          View Weekly Plan
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate("/calendar")}
                        >
                          View Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 border-dashed border-2">
              <BrainCircuit className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-500 mb-2">
                Ready for Analysis
              </h3>
              <p className="text-gray-400 max-w-md">
                Click the Run AI Analysis button to let the system optimize your
                academic schedule.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}