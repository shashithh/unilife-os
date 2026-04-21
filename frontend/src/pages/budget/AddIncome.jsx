import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { addIncome } from '../../services/budgetApi';
import { CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';

const incomeCategories = [
  { name: 'Salary' },
  { name: 'Freelance' },
  { name: 'Investments' },
  { name: 'Business' },
  { name: 'Gifts' },
  { name: 'Other' }
];

export function AddIncome() {
  const navigate = useNavigate();

  // Income State
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

  const validateIncome = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Income title is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.title)) {
      newErrors.title = 'Title can only contain letters and spaces';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Title cannot exceed 50 characters';
    }

    // Amount Validations
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be strictly greater than 0';
    } else if (Number(formData.amount) > 1000000000) {
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
          newErrors.month = 'Cannot log income for future months';
        }
      }
    }

    if (formData.note && formData.note.length > 50) {
      newErrors.note = 'Note cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    if (validateIncome()) {
      try {
        setLoading(true);
        setSubmitError(null);
        
        await addIncome({
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
        setSubmitError(err.message || 'Failed to add income');
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
          <h1 className="text-2xl font-bold text-gray-900">Add Income</h1>
          <p className="text-gray-600 text-sm">Record a new source of income.</p>
        </div>
      </div>

      <BudgetNav />

      <div className="animate-fade-in">
        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Income added successfully! Redirecting...</span>
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Error: {submitError}</span>
          </div>
        )}

        <Card className="p-8 border-t-4 border-t-emerald-500 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <form onSubmit={handleIncomeSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Income Title" 
                placeholder="e.g. Monthly Salary" 
                value={formData.title} 
                maxLength={50}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  setFormData({ ...formData, title: val });
                }} 
                error={errors.title || (formData.title.length >= 50 ? "Maximum 50 characters reached!" : null)} 
                className="md:col-span-2" 
              />
              
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
              
              <Input 
                as="select" 
                label="Category Source" 
                value={formData.categoryId} 
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
                error={errors.categoryId} 
                options={[{ value: '', label: 'Select a Source...' }, ...incomeCategories.map((c) => ({ value: c.name, label: c.name }))]} 
              />
              
              <Input 
                type="date" 
                label="Date Received" 
                value={formData.date} 
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                error={errors.date} 
              />
              
              <Input 
                type="month" 
                label="Month" 
                value={formData.month} 
                max={new Date().toISOString().slice(0, 7)}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })} 
                error={errors.month} 
              />
              
              <Input
                as="textarea"
                label="Note (Optional)"
                placeholder="Add any extra details..."
                value={formData.note}
                maxLength={50}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                error={errors.note || (formData.note.length >= 50 ? "Maximum character limit reached!" : null)}
                className="md:col-span-2"
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
              <Button type="button" variant="secondary" onClick={() => navigate('/budget')}>Cancel</Button>
              <Button type="submit" variant="primary" className="bg-gradient-to-r from-emerald-500 to-green-600 border-none shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50" disabled={isSuccess || loading}>
                {loading ? 'Processing...' : 'Save Income'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
