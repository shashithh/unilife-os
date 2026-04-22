import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  const plannerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleExportPDF = async () => {
    if (!plannerRef.current) return;

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(plannerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let finalWidth = imgWidth;
      let finalHeight = imgHeight;

      if (imgHeight > pdfHeight - 10) {
        finalHeight = pdfHeight - 10;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }

      const x = (pdfWidth - finalWidth) / 2;
      const y = 5;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save('weekly-study-plan.pdf');
    } catch (error) {
      console.error('PDF download failed:', error);
    } finally {
      setIsDownloading(false);
    }
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

        <Button
          variant="secondary"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportPDF}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Export PDF'}
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

      <div ref={plannerRef} className="bg-white p-4 rounded-2xl mt-6">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Weekly Timetable</h2>
          <p className="text-sm text-gray-500">Smart Academic Planner</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {days.map((day) => (
            <Card
              key={day}
              className="flex flex-col h-full min-h-[500px] bg-white border"
            >
              <div className="p-3 border-b border-gray-100 bg-gray-50 text-center font-semibold text-gray-800">
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
                      className={`p-3 rounded-xl border text-sm shadow-sm relative ${getPriorityStyles(item.priority)}`}
                    >
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
    </div>
  );
}