import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { subjects } from '../../data/mockData';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export function AddTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    deadline: '',
    priority: '',
    estimatedHours: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.subjectId) newErrors.subjectId = 'Subject is required';

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    if (!formData.priority) newErrors.priority = 'Priority must be selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 text-sm">
            Add an assignment, project, or study session.
          </p>
        </div>
      </div>

      <PlannerNav />

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">
            Task created successfully! Redirecting...
          </span>
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Task Title"
              placeholder="e.g. Complete Lab Report"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value
                })
              }
              error={errors.title}
              className="md:col-span-2"
            />

            <Input
              as="select"
              label="Subject"
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectId: e.target.value
                })
              }
              error={errors.subjectId}
              options={subjects.map((s) => ({
                value: s.id,
                label: s.name
              }))}
            />

            <Input
              type="date"
              label="Deadline Date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deadline: e.target.value
                })
              }
              error={errors.deadline}
            />

            <Input
              as="select"
              label="Priority Level"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value
                })
              }
              error={errors.priority}
              options={[
                {
                  value: 'High',
                  label: 'High Priority (Red)'
                },
                {
                  value: 'Medium',
                  label: 'Medium Priority (Orange)'
                },
                {
                  value: 'Low',
                  label: 'Low Priority (Green)'
                }
              ]}
            />

            <Input
              type="number"
              label="Estimated Hours"
              placeholder="e.g. 2.5"
              step="0.5"
              min="0.5"
              value={formData.estimatedHours}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedHours: e.target.value
                })
              }
            />

            <Input
              as="textarea"
              label="Description / Notes (Optional)"
              placeholder="Add any specific requirements or links..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              className="md:col-span-2"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary" disabled={isSuccess}>
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}