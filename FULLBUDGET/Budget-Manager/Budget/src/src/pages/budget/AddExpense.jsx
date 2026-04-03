import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { budgetCategories } from '../../data/budgetMockData';
import { addExpense } from '../../services/budgetApi';
import { CheckCircle2, ArrowLeft, AlertTriangle, PlusCircle } from 'lucide-react';

export function AddExpense() {
  const navigate = useNavigate();

  // Expense State
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    month: new Date().toISOString().slice(0, 7),
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateExpense = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Expense title is required';

    // Amount Validations
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be strictly greater than 0';
    } else if (Number(formData.amount) > 100000000) {
      newErrors.amount = 'Amount exceeds logical boundaries.';
    }

    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (!formData.month) {
      newErrors.month = 'Month is required';
    } else {
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(formData.month)) {
        newErrors.month = 'Invalid month format';
      } else {
        const currentDate = new Date();
        const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        if (formData.month > currentYearMonth) {
          newErrors.month = 'Cannot log expenses for future months';
        }
      }
    }

    if (formData.note && formData.note.length > 150) {
      newErrors.note = 'Note cannot exceed 150 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (validateExpense()) {
      try {
        setLoading(true);
        setSubmitError(null);
        await addExpense({
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.categoryId,
          date: new Date(formData.date).toISOString(),
          month: formData.month,
          note: formData.note
        });
        setIsSuccess(true);
        setTimeout(() => navigate('/budget/history'), 1500);
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/budget')}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
          <p className="text-gray-600 text-sm">Record a new expense with details.</p>
        </div>
      </div>

      <BudgetNav />

      <div className="animate-fade-in">
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Expense added successfully! Redirecting...</span>
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Error: {submitError}</span>
          </div>
        )}

        <Card className="p-8">
          <form onSubmit={handleExpenseSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Expense Title" placeholder="e.g. Lunch at Canteen" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} error={errors.title} className="md:col-span-2" />
              <div className="relative">
                <Input
                  type="number"
                  label="Amount (LKR)"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/-/g, '');
                    setFormData({ ...formData, amount: val });
                  }}
                  error={errors.amount}
                />
              </div>
              <Input as="select" label="Category" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} error={errors.categoryId} options={budgetCategories.map((c) => ({ value: c.name, label: c.name }))} />
              <Input type="date" label="Date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} error={errors.date} />
              <Input type="month" label="Month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} error={errors.month} />
              <Input
                as="textarea"
                label="Note (Optional)"
                placeholder="Add any extra details..."
                value={formData.note}
                maxLength={150}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                error={errors.note || (formData.note.length >= 150 ? "Maximum character limit reached!" : null)}
                className="md:col-span-2"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => navigate('/budget')}>Cancel</Button>
              <Button type="submit" variant="primary" className="bg-gradient-to-r from-teal-500 to-cyan-600" disabled={isSuccess || loading}>
                {loading ? 'Saving...' : 'Save Expense'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}