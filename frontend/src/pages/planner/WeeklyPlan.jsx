import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
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

  const schedule = {
    Monday: [
      {
        time: '09:00 AM',
        task: 'CS101 Lecture',
        type: 'class',
        color: 'bg-blue-100 text-blue-700 border-blue-200'
      },
      {
        time: '02:00 PM',
        task: 'Data Structures Assignment',
        type: 'study',
        color: 'bg-blue-500 text-white border-blue-600',
        ai: true
      }
    ],

    Tuesday: [
      {
        time: '10:00 AM',
        task: 'MATH201 Lecture',
        type: 'class',
        color: 'bg-purple-100 text-purple-700 border-purple-200'
      },
      {
        time: '03:00 PM',
        task: 'Calculus Practice',
        type: 'study',
        color: 'bg-purple-500 text-white border-purple-600',
        ai: true
      }
    ],

    Wednesday: [
      {
        time: '11:00 AM',
        task: 'PHY101 Lab',
        type: 'class',
        color: 'bg-teal-100 text-teal-700 border-teal-200'
      },
      {
        time: '04:00 PM',
        task: 'Physics Lab Report',
        type: 'study',
        color: 'bg-teal-500 text-white border-teal-600',
        ai: true
      }
    ],

    Thursday: [
      {
        time: '09:00 AM',
        task: 'ENG101 Seminar',
        type: 'class',
        color: 'bg-orange-100 text-orange-700 border-orange-200'
      },
      {
        time: '01:00 PM',
        task: 'Essay Draft Writing',
        type: 'study',
        color: 'bg-orange-500 text-white border-orange-600',
        ai: true
      }
    ],

    Friday: [
      {
        time: '10:00 AM',
        task: 'Study Group',
        type: 'collab',
        color: 'bg-gray-100 text-gray-700 border-gray-200'
      },
      {
        time: '02:00 PM',
        task: 'Weekly Review',
        type: 'study',
        color: 'bg-indigo-500 text-white border-indigo-600',
        ai: true
      }
    ],

    Saturday: [
      {
        time: '10:00 AM',
        task: 'Deep Work: Calculus',
        type: 'study',
        color: 'bg-purple-500 text-white border-purple-600',
        ai: true
      }
    ],

    Sunday: [
      {
        time: '06:00 PM',
        task: 'Plan Next Week',
        type: 'admin',
        color: 'bg-gray-800 text-white border-gray-900'
      }
    ]
  };

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

      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <span className="text-sm text-gray-700">
          <strong>AI Note:</strong> I've distributed your heavy Calculus
          workload across Tuesday and Saturday to prevent burnout.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <Card
            key={day}
            className="flex flex-col h-full min-h-[500px] bg-white/60"
          >
            <div className="p-3 border-b border-gray-100 bg-white/80 text-center font-semibold text-gray-800">
              {day}
            </div>

            <div className="p-3 flex-1 space-y-3">
              {schedule[day]?.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-sm shadow-sm relative group cursor-pointer hover:scale-[1.02] transition-transform ${item.color}`}
                >
                  {item.ai && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    </div>
                  )}

                  <p className="text-xs opacity-80 mb-1 font-medium">
                    {item.time}
                  </p>
                  <p className="font-semibold leading-tight">{item.task}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}