import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { Input } from '../../components/ui/Input';
import { ChevronLeft, ChevronRight, Plus, X, CheckCircle2 } from 'lucide-react';

export function Calendar() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: ''
  });

  const [events, setEvents] = useState([
    { day: 15, title: 'IT3040 Project Due', color: 'bg-red-100 text-red-700 border-red-200' },
    { day: 24, title: 'Study: Calculus', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { day: 28, title: 'NDM Lab Exam', color: 'bg-orange-100 text-orange-700 border-orange-200' }
  ]);

  const [errors, setErrors] = useState({});

  const daysInMonth = 31;
  const startDay = 3;
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startDay + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const validateField = (name, value) => {
    let error = '';

    if (name === 'title') {
      if (!value.trim()) {
        error = 'Event title is required';
      }
    }

    if (name === 'date') {
      if (!value) {
        error = 'Date is required';
      }
    }

    if (name === 'time') {
      if (!value) {
        error = 'Time is required';
      }
    }

    if (name === 'type') {
      if (!value) {
        error = 'Event type is required';
      }
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {
      title: validateField('title', formData.title),
      date: validateField('date', formData.date),
      time: validateField('time', formData.time),
      type: validateField('type', formData.type)
    };

    setErrors(newErrors);
    return !newErrors.title && !newErrors.date && !newErrors.time && !newErrors.type;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const getEventColor = (type) => {
    if (type === 'exam') return 'bg-red-100 text-red-700 border-red-200';
    if (type === 'study') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (type === 'assignment') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedDay = new Date(formData.date).getDate();

      setEvents((prev) => [
        ...prev,
        {
          day: selectedDay,
          title: formData.title,
          color: getEventColor(formData.type)
        }
      ]);

      setIsSuccess(true);

      setFormData({
        title: '',
        date: '',
        time: '',
        type: ''
      });

      setErrors({});

      setTimeout(() => {
        setIsSuccess(false);
        setShowEventForm(false);
      }, 1200);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">
            View your deadlines and study sessions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowEventForm(true)}
        >
          Add Event
        </Button>
      </div>

      <PlannerNav />

      <Card className="flex-1 p-6 flex flex-col bg-white/80">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">October 2026</h2>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
            />
            <Button variant="secondary" size="sm">
              Today
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden flex-1 border border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}

          {days.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[100px] bg-white p-2 transition-colors hover:bg-gray-50 cursor-pointer ${!day ? 'bg-gray-50/50' : ''
                }`}
            >
              {day && (
                <>
                  <span
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${day === 24 ? 'bg-blue-600 text-white' : 'text-gray-700'
                      }`}
                  >
                    {day}
                  </span>

                  {events
                    .filter((event) => event.day === day)
                    .map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`mt-1 p-1 text-xs rounded border truncate ${event.color}`}
                      >
                        {event.title}
                      </div>
                    ))}
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {showEventForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setShowEventForm(false);
                setErrors({});
                setIsSuccess(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Event</h3>
            <p className="text-sm text-gray-600 mb-6">
              Create a new event for your calendar.
            </p>

            {isSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Event added successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Event Title"
                name="title"
                placeholder="e.g. Database Lab"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
              />

              <Input
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
              />

              <Input
                type="time"
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
              />

              <Input
                as="select"
                label="Event Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                error={errors.type}
                options={[
                  { value: '', label: 'Select event type' },
                  { value: 'class', label: 'Class' },
                  { value: 'study', label: 'Study Session' },
                  { value: 'assignment', label: 'Assignment' },
                  { value: 'exam', label: 'Exam' }
                ]}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowEventForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}