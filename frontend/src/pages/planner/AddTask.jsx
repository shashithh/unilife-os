import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PlannerNav } from '../../components/planner/PlannerNav';
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
  const [subjects, setSubjects] = useState([]);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        const data = await response.json();
        if (response.ok) {
          setSubjects(data);
        } else {
          console.error('Failed to fetch subjects:', data.message);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 20) {
      newErrors.title = 'Task title must be 20 characters or less';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }

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

    if (!formData.priority) {
      newErrors.priority = 'Priority must be selected';
    }

    if (!formData.estimatedHours) {
      newErrors.estimatedHours = 'Estimated hours is required';
    } else if (Number(formData.estimatedHours) < 0.5) {
      newErrors.estimatedHours = 'Estimated hours must be at least 0.5';
    }

    if (formData.description.length > 50) {
      newErrors.description = 'Description must be 50 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 20);

    setFormData({
      ...formData,
      title: value
    });

    setErrors((prev) => ({
      ...prev,
      title: value.trim() ? '' : 'Task title is required'
    }));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value.slice(0, 50);

    setFormData({
      ...formData,
      description: value
    });

    setErrors((prev) => ({
      ...prev,
      description: value.length <= 50 ? '' : 'Description must be 50 characters or less'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedHours: Number(formData.estimatedHours)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/planner/tasks');
        }, 1500);
      } else {
        setSubmitError(data.message || 'Failed to create task');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setSubmitError('Server error while creating task');
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
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">
            Task created successfully! Redirecting...
          </span>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {submitError}
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Task Title"
                placeholder="e.g. Complete Lab Report"
                value={formData.title}
                onChange={handleTitleChange}
                error={errors.title}
              />
              <div className="flex justify-end mt-1">
                <p className="text-xs text-gray-400">{formData.title.length}/20</p>
              </div>
            </div>

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
              options={[
                { value: '', label: 'Select Subject' },
                ...subjects.map((s) => ({
                  value: s._id,
                  label: s.subjectName
                }))
              ]}
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
                { value: '', label: 'Select Priority' },
                { value: 'High', label: 'High Priority (Red)' },
                { value: 'Medium', label: 'Medium Priority (Orange)' },
                { value: 'Low', label: 'Low Priority (Green)' }
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
              error={errors.estimatedHours}
            />

            <div className="md:col-span-2">
              <Input
                as="textarea"
                label="Description / Notes (Optional)"
                placeholder="Add any specific requirements or links..."
                value={formData.description}
                onChange={handleDescriptionChange}
                error={errors.description}
              />
              <div className="flex justify-end mt-1">
                <p className="text-xs text-gray-400">{formData.description.length}/50</p>
              </div>
            </div>
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