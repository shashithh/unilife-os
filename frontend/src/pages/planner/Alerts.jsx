import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { AlertOctagon, Clock, BellRing, Settings } from 'lucide-react';
export function Alerts() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Alerts & Reminders
          </h1>
          <p className="text-gray-600">
            Stay on top of your deadlines and schedule changes.
          </p>
        </div>
        <Button variant="secondary" icon={<Settings className="w-4 h-4" />}>
          Settings
        </Button>
      </div>

      <PlannerNav />

      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-gray-900">Action Required</h2>
        </div>

        <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-red-900">
                Overdue: Read Chapter 4 & 5
              </h3>
              <p className="text-sm text-red-700 mt-1">
                This task was due yesterday. It is affecting your productivity
                score.
              </p>
            </div>
            <Button variant="danger" size="sm">
              Reschedule
            </Button>
          </div>
        </Card>

        <div className="flex items-center gap-2 mb-4 mt-8">
          <Clock className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">
            Upcoming Deadlines
          </h2>
        </div>

        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900">Physics Lab Report</h3>
              <p className="text-sm text-gray-600 mt-1">
                Due tomorrow at 11:59 PM. You have 3 estimated hours remaining.
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Mark Done
            </Button>
          </div>
        </Card>

        <div className="flex items-center gap-2 mb-4 mt-8">
          <BellRing className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900">
            System Notifications
          </h2>
        </div>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900">Weekly Plan Generated</h3>
              <p className="text-sm text-gray-600 mt-1">
                AI has successfully generated your study plan for next week.
              </p>
            </div>
            <Button variant="secondary" size="sm">
              View Plan
            </Button>
          </div>
        </Card>
      </div>
    </div>);

}