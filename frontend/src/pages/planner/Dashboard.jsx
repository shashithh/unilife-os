import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TaskCard } from '../../components/planner/TaskCard';
import { PlannerNav } from '../../components/planner/PlannerNav';
import {
  Plus,
  BrainCircuit,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Calendar as CalendarIcon,
  Sparkles
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    pendingTasks: 0,
    criticalRisk: 0,
    productivityScore: 0,
    studyStreak: 0
  });

  const [aiRecommendations, setAiRecommendations] = useState({
    overdue: [],
    upcoming: [],
    notifications: []
  });

  useEffect(() => {
    fetch('/api/planner/dashboard')
      .then((res) => res.json())
      .then(setDashboardStats)
      .catch((err) => console.error('Dashboard stats error:', err));

    fetch('/api/tasks')
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error('Tasks fetch error:', err));

    fetch('/api/planner/alerts-summary')
      .then((res) => res.json())
      .then(setAiRecommendations)
      .catch((err) => console.error('Alerts fetch error:', err));
  }, []);

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good morning, Biseka! 👋
          </h1>
          <p className="text-gray-600">
            Here's your academic overview for today.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/add-subject')}
          >
            Subject
          </Button>

          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/add-task')}
          >
            Add Task
          </Button>
        </div>
      </div>

      <PlannerNav />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardStats.pendingTasks}
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Critical Risk</p>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardStats.criticalRisk}
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Productivity Score
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardStats.productivityScore}
              <span className="text-sm text-gray-400 font-normal">/100</span>
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-orange-500">
          <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Study Streak</p>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardStats.studyStreak}
              <span className="text-sm text-gray-400 font-normal"> days</span>
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <h2 className="text-lg font-bold">AI Study Assistant</h2>
              </div>

              <p className="text-indigo-100 mb-6 max-w-lg">
                I've analyzed your upcoming deadlines and past completion rates.
                Thursday is looking overloaded. Would you like me to generate an
                optimized weekly plan?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="bg-white text-indigo-900 hover:bg-indigo-50"
                  onClick={() => navigate('/ai-scheduler')}
                >
                  Generate Weekly Plan
                </Button>
              </div>
            </div>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Priority Tasks</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tasks')}
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTasks.slice(0, 4).map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
              <Button
                variant="ghost"
                size="sm"
                icon={<CalendarIcon className="w-4 h-4" />}
                onClick={() => navigate('/calendar')}
              />
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex flex-col items-center justify-center text-blue-700 font-bold">
                  <span className="text-xs uppercase">Oct</span>
                  <span>24</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Data Structures Lab
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    2:00 PM - 4:00 PM
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center text-purple-700 font-bold">
                  <span className="text-xs uppercase">Oct</span>
                  <span>25</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Calculus Study Session
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    AI Scheduled • 2 hrs
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Smart Alerts
            </h2>

            <div className="space-y-3">
              {aiRecommendations.notifications.map((rec, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <AlertOctagon className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {rec.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {rec.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}