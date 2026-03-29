import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { Button } from '../../components/ui/Button';
import { Sparkles, Download } from 'lucide-react';

export function WeeklyPlan() {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const [schedule, setSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  useEffect(() => {
    fetch('/api/planner/weekly-plan')
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
      })
      .catch((err) => console.error('Error fetching weekly plan:', err));
  }, []);

  const getPriorityStyles = (priority) => {
    if (priority === 'High') {
      return 'bg-red-500 text-white border-red-600';
    }
    if (priority === 'Medium') {
      return 'bg-orange-500 text-white border-orange-600';
    }
    return 'bg-green-500 text-white border-green-600';
  };

  const totalPlannedTasks = Object.values(schedule).reduce(
    (sum, items) => sum + items.length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Weekly Study Plan
          </h1>
          <p className="text-gray-600">
            Your AI-optimized schedule for maximum productivity.
          </p>
        </div>

        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
          Export PDF
        </Button>
      </div>

      <PlannerNav />

      {totalPlannedTasks === 0 && (
        <Card className="p-6 mt-6 mb-6 text-center">
          <p className="text-gray-600">
            No upcoming tasks available for this weekly plan. Add a task first, then run AI analysis.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mt-6">
        {days.map((day) => (
          <Card
            key={day}
            className="flex flex-col h-full min-h-[500px] bg-white/60"
          >
            <div className="p-3 border-b border-gray-100 bg-white/80 text-center font-semibold text-gray-800">
              {day}
            </div>

            <div className="p-3 flex-1 space-y-3">
              {schedule[day]?.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  No tasks
                </div>
              ) : (
                schedule[day].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-sm shadow-sm relative group cursor-pointer hover:scale-[1.02] transition-transform ${getPriorityStyles(item.priority)}`}
                  >
                    {item.isAi && (
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                      </div>
                    )}

                    <p className="text-xs opacity-90 mb-1 font-medium">
                      {item.time}
                    </p>

                    {item.subjectCode && (
                      <p className="text-xs font-semibold opacity-90 mb-1">
                        {item.subjectCode}
                      </p>
                    )}

                    <p className="font-semibold leading-tight">{item.task}</p>

                    <p className="text-xs mt-2 opacity-90">
                      Priority: {item.priority}
                    </p>

                    <p className="text-xs opacity-90">
                      Estimated Hours: {item.estimatedHours}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}