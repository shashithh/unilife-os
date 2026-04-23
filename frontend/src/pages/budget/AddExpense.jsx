import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';
import { addExpense } from '../../services/budgetApi';

const CATEGORIES = [
  'Food',
  'Transport',
  'Books',
  'Entertainment',
  'Health',
  'Clothing',
  'Utilities',
  'Education',
  'Personal Care',
  'Other'
];

export function AddExpense() {
  const navigate = useNavigate();

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: todayString,
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'title': {
        if (!value.trim()) return 'Title is required';
        if (value.length > 20) return 'Title must be 20 characters or less';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Title can contain letters only';
        return '';
      }

      case 'amount': {
        if (!value) return 'Amount is required';
        if (isNaN(value) || Number(value) <= 0) return 'Amount must be greater than 0';
        return '';
      }

      case 'date': {
        if (!value) return 'Date is required';

        const selectedDate = new Date(value);
        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = selectedDate.getMonth();

        if (selectedYear !== currentYear || selectedMonth !== currentMonth) {
          return 'Date must be within the current month only';
        }

        return '';
      }

      case 'note': {
        if (value.length > 50) return 'Note must be 50 characters or less';
        return '';
      }

      default:
        return '';
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    Object.keys(data).forEach((key) => {
      const message = validateField(key, data[key]);
      if (message) newErrors[key] = message;
    });

    return newErrors;
  };

  const f = (key, value) => {
    const updatedForm = { ...form, [key]: value };
    setForm(updatedForm);

    const fieldError = validateField(key, value);
    setErrors((prev) => ({
      ...prev,
      [key]: fieldError
    }));
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({
      ...prev,
      [key]: true
    }));

    const fieldError = validateField(key, form[key]);
    setErrors((prev) => ({
      ...prev,
      [key]: fieldError
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {
      title: true,
      amount: true,
      date: true,
      note: true
    };
    setTouched(allTouched);

    const formErrors = validateForm(form);
    setErrors(formErrors);

    if (Object.values(formErrors).some(Boolean)) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const month = form.date.slice(0, 7);

      await addExpense({
        ...form,
        amount: parseFloat(form.amount),
        month
      });

      setSuccess(true);
      setTimeout(() => navigate('/budget'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Expense Added!</h2>
        <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate('/budget')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Budget
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-indigo-600" /> Add Expense
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => f('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder="e.g. Grocery"
            maxLength={20}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${touched.title && errors.title ? 'border-red-400' : 'border-gray-200'
              }`}
          />
          <div className="flex justify-between mt-1">
            {touched.title && errors.title ? (
              <p className="text-red-500 text-xs">{errors.title}</p>
            ) : (
              <p className="text-gray-400 text-xs">Only letters, max 20 characters</p>
            )}
            <p className="text-gray-400 text-xs">{form.title.length}/20</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Amount (LKR) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => f('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              placeholder="0.00"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${touched.amount && errors.amount ? 'border-red-400' : 'border-gray-200'
                }`}
            />
            {touched.amount && errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => f('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${touched.date && errors.date ? 'border-red-400' : 'border-gray-200'
                }`}
            />
            {touched.date && errors.date ? (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">Current month dates only</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Category *
          </label>
          <select
            value={form.category}
            onChange={(e) => f('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Note (Optional)
          </label>
          <textarea
            value={form.note}
            onChange={(e) => f('note', e.target.value)}
            onBlur={() => handleBlur('note')}
            rows={3}
            placeholder="Any additional notes..."
            maxLength={50}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none ${touched.note && errors.note ? 'border-red-400' : 'border-gray-200'
              }`}
          />
          <div className="flex justify-between mt-1">
            {touched.note && errors.note ? (
              <p className="text-red-500 text-xs">{errors.note}</p>
            ) : (
              <p className="text-gray-400 text-xs">Maximum 50 characters</p>
            )}
            <p className="text-gray-400 text-xs">{form.note.length}/50</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}