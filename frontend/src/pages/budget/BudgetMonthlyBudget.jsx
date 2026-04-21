import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { setMonthlyBudget, getMonthlyBudgets, deleteMonthlyBudget } from '../../services/budgetApi';
import { CheckCircle2, ArrowLeft, AlertTriangle, Wallet, Trash2, Edit } from 'lucide-react';

export function BudgetMonthlyBudget() {
  const navigate = useNavigate();
  const location = useLocation();

  // Monthly Budget State
  const [formData, setFormData] = useState({
    month: new Date().toISOString().slice(0, 7),
    amount: ''
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Existing Monthly Budgets
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Handle prefilled data from navigation state
  useEffect(() => {
    if (location.state?.selectedMonth) {
      setFormData(prev => ({
        ...prev,
        month: location.state.selectedMonth,
        amount: location.state.prefillAmount || ''
      }));
    }
  }, [location.state]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchMonthlyBudgets = async () => {
      try {
        setLoadingBudgets(true);
        const budgets = await getMonthlyBudgets();
        setMonthlyBudgets(budgets);
      } catch (err) {
        console.error('Failed to load monthly budgets', err);
      } finally {
        setLoadingBudgets(false);
      }
    };
    fetchMonthlyBudgets();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Month Validations
    if (!formData.month) {
      newErrors.month = 'Month is required';
    } else {
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(formData.month)) {
        newErrors.month = 'Invalid month format';
      } else if (!isEditing) {
        const exists = monthlyBudgets.some(b => b.month === formData.month);
        if (exists) {
          newErrors.month = 'Budget already exists. Please edit it below.';
        }
      }
    }

    // Amount Validations
    if (!formData.amount) {
      newErrors.amount = 'Budget amount is required';
    } else if (isNaN(Number(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be strictly greater than 0';
    } else if (Number(formData.amount) > 1000000000) {
      newErrors.amount = 'Amount exceeds maximum allowed limit (1 Billion)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        setSubmitError(null);
        await setMonthlyBudget(formData.month, parseFloat(formData.amount));
        setIsSuccess(true);
        // Refresh the monthly budgets list
        const budgets = await getMonthlyBudgets();
        setMonthlyBudgets(budgets);

        if (isEditing) {
          // Reset to create mode after successful edit
          handleCancelEdit();
        } else {
          // Clear amount but keep month for create mode
          setFormData({ ...formData, amount: '' });
        }

        setTimeout(() => setIsSuccess(false), 3000);
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteMonthlyBudget = async (month) => {
    if (!window.confirm(`Are you sure you want to delete the budget for ${month}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteMonthlyBudget(month);
      // Refresh the monthly budgets list
      const budgets = await getMonthlyBudgets();
      setMonthlyBudgets(budgets);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMonthlyBudget = (budget) => {
    setIsEditing(true);
    setEditingBudget(budget);
    setFormData({
      month: budget.month,
      amount: budget.monthlyBudget.toString()
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingBudget(null);
    setFormData({
      month: new Date().toISOString().slice(0, 7),
      amount: ''
    });
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/budget')}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Monthly Budget' : 'Set Monthly Budget'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isEditing ? 'Update the budget for this month.' : 'Set a specific budget for a month.'}
          </p>
        </div>
      </div>

      <BudgetNav />

      <div className="animate-fade-in">
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">
              Monthly budget {isEditing ? 'updated' : 'set'} successfully!
            </span>
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Error: {submitError}</span>
          </div>
        )}

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="month"
                label="Month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                error={errors.month}
                disabled={isEditing}
              />
              <div className="relative">
                <Input
                  type="number"
                  label="Monthly Budget (LKR)"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onKeyDown={(e) => {
                    // Prevent typing minus or exponential characters
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
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              {isEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                className="bg-gradient-to-r from-teal-500 to-cyan-600"
                icon={<Wallet className="w-4 h-4" />}
                disabled={loading}
              >
                {loading
                  ? (isEditing ? 'Updating...' : 'Setting...')
                  : (isEditing ? 'Update Monthly Budget' : 'Set Monthly Budget')
                }
              </Button>
            </div>
          </form>
        </Card>

        {/* Existing Monthly Budgets Section */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Monthly Budgets</h2>

          {loadingBudgets ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : monthlyBudgets.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No monthly budgets set yet.</p>
          ) : (
            <div className="space-y-3">
              {monthlyBudgets.map((budget) => (
                <div key={budget.month} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">{budget.month}</p>
                    <p className="text-sm text-gray-600">Monthly Budget</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-gray-900">{formatCurrency(budget.monthlyBudget)}</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => handleEditMonthlyBudget(budget)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleDeleteMonthlyBudget(budget.month)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}