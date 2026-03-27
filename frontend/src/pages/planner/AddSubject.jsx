import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function AddSubject() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: ''
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';

    if (name === 'subjectName') {
      const nameRegex = /^[A-Za-z\s]+$/;

      if (!value.trim()) {
        error = 'Subject name is required';
      } else if (!nameRegex.test(value)) {
        error = 'Subject name can contain only letters and spaces';
      }
    }

    if (name === 'subjectCode') {
      const codeRegex = /^[A-Za-z]{2}\d{4}$/;

      if (!value.trim()) {
        error = 'Subject code is required';
      } else if (!codeRegex.test(value)) {
        error = 'Subject code must be 2 letters followed by 4 digits';
      }
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {
      subjectName: validateField('subjectName', formData.subjectName),
      subjectCode: validateField('subjectCode', formData.subjectCode)
    };

    setErrors(newErrors);
    return !newErrors.subjectName && !newErrors.subjectCode;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === 'subjectCode' ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Subject</h1>
          <p className="text-gray-600 text-sm">
            Organize your tasks by course or subject.
          </p>
        </div>
      </div>

      <PlannerNav />

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Subject added successfully!</span>
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Subject Name"
            name="subjectName"
            placeholder="e.g. Introduction to Psychology"
            value={formData.subjectName}
            onChange={handleChange}
            error={errors.subjectName}
            required
          />

          <Input
            label="Subject Code"
            name="subjectCode"
            placeholder="e.g. CS1234"
            value={formData.subjectCode}
            onChange={handleChange}
            error={errors.subjectCode}
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-700 ml-1 mb-2 block">
              Color Theme
            </label>

            <div className="flex gap-3">
              {[
                'bg-blue-500',
                'bg-purple-500',
                'bg-teal-500',
                'bg-orange-500',
                'bg-red-500',
                'bg-green-500'
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-full ${color} border-2 border-white shadow-sm hover:scale-110 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-gray-400`}
                />
              ))}
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
              Save Subject
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}