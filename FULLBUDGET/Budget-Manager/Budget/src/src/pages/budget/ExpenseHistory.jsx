import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { ExpenseCard } from '../../components/budget/ExpenseCard';
import { budgetCategories } from '../../data/budgetMockData';
import { getExpenses, deleteExpense, updateExpense } from '../../services/budgetApi';
import { Plus, Filter, Search, AlertTriangle, X } from 'lucide-react';
export function ExpenseHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit/Delete States
  const [editingExpense, setEditingExpense] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    date: '',
    month: '',
    note: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (expense) => {
    if (!window.confirm(`Are you sure you want to completely delete "${expense.title}"?`)) return;
    try {
      setLoading(true);
      await deleteExpense(expense._id || expense.id);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (expense) => {
    setEditingExpense(expense);
    setEditFormData({
      title: expense.title,
      amount: expense.amount ? expense.amount.toString() : '',
      categoryId: expense.category || expense.categoryId,
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
      month: expense.month || (expense.date ? expense.date.slice(0, 7) : ''),
      note: expense.note || ''
    });
    setEditErrors({});
  };

  const validateEdit = () => {
    const newErrors = {};
    if (!editFormData.title.trim()) newErrors.title = 'Expense title is required';
    if (!editFormData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(editFormData.amount))) newErrors.amount = 'Must be valid number';
    else if (Number(editFormData.amount) <= 0) newErrors.amount = 'Must be strictly greater than 0';

    if (!editFormData.categoryId) newErrors.categoryId = 'Category is required';
    if (!editFormData.date) newErrors.date = 'Date is required';

    if (!editFormData.month) {
      newErrors.month = 'Month is required';
    } else {
      const currentDate = new Date();
      const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      if (editFormData.month > currentYearMonth) {
        newErrors.month = 'Cannot log expenses for future months';
      }
    }

    if (editFormData.note && editFormData.note.length > 150) newErrors.note = 'Cannot exceed 150 characters';
    
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (validateEdit()) {
      try {
        setIsSaving(true);
        const payload = {
          title: editFormData.title,
          amount: parseFloat(editFormData.amount),
          category: editFormData.categoryId,
          date: new Date(editFormData.date).toISOString(),
          month: editFormData.month,
          note: editFormData.note
        };
        await updateExpense(editingExpense._id || editingExpense.id, payload);
        setEditingExpense(null);
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        alert("Update failed: " + err.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const filteredExpenses = expenses.
    filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ?
        exp.category === filterCategory :
        true;

      let matchesFrom = true;
      let matchesTo = true;

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        const expenseDate = new Date(exp.date);
        matchesFrom = expenseDate >= from;
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        const expenseDate = new Date(exp.date);
        matchesTo = expenseDate <= to;
      }

      return matchesSearch && matchesCategory && matchesFrom && matchesTo;
    }).
    sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest')
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Expenses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Expense History
          </h1>
          <p className="text-gray-600">
            View and manage all your past transactions.
          </p>
        </div>
        <Button
          variant="primary"
          className="bg-gradient-to-r from-teal-500 to-cyan-600"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/budget/add')}>

          Add Expense
        </Button>
      </div>

      <BudgetNav />

      <Card className="p-4 mb-8 flex flex-col md:flex-row gap-4 items-end bg-white/50">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />

        </div>
        <div className="w-full md:w-40">
          <Input
            type="date"
            label="From"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="!gap-0" />
        </div>
        <div className="w-full md:w-40">
          <Input
            type="date"
            label="To"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="!gap-0" />
        </div>
        <div className="w-full md:w-48">
          <Input
            as="select"
            label=""
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              {
                value: '',
                label: 'All Categories'
              },
              ...budgetCategories.map((c) => ({
                value: c.name,
                label: c.name
              }))]
            }
            className="!gap-0" />

        </div>
        <div className="w-full md:w-48">
          <Input
            as="select"
            label=""
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              {
                value: 'newest',
                label: 'Newest First'
              },
              {
                value: 'oldest',
                label: 'Oldest First'
              },
              {
                value: 'highest',
                label: 'Highest Amount'
              },
              {
                value: 'lowest',
                label: 'Lowest Amount'
              }]
            }
            className="!gap-0" />

        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExpenses.map((expense) =>
          <ExpenseCard key={expense.id || expense._id} expense={expense} onEdit={handleEditOpen} onDelete={handleDelete} />
        )}

        {filteredExpenses.length === 0 &&
          <div className="col-span-full py-12 text-center text-gray-500">
            <p className="text-lg font-medium text-gray-900 mb-1">
              No expenses found
            </p>
            <p>Try adjusting your search or filters.</p>
          </div>
        }
      </div>

      {editingExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-6 animate-fade-in shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Expense</h2>
              <button onClick={() => setEditingExpense(null)} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Expense Title" value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} error={editErrors.title} className="md:col-span-2" />
                
                <div className="relative">
                  <Input 
                    type="number" 
                    label="Amount (LKR)" 
                    step="0.01" 
                    min="0" 
                    value={editFormData.amount} 
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/-/g, '');
                      setEditFormData({ ...editFormData, amount: val });
                    }} 
                    error={editErrors.amount} 
                  />
                </div>
                
                <Input as="select" label="Category" value={editFormData.categoryId} onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })} error={editErrors.categoryId} options={budgetCategories.map((c) => ({ value: c.name, label: c.name }))} />
                <Input type="date" label="Date" value={editFormData.date} onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })} error={editErrors.date} />
                <Input type="month" label="Month" value={editFormData.month} onChange={(e) => setEditFormData({ ...editFormData, month: e.target.value })} error={editErrors.month} />
                
                <Input 
                  as="textarea" 
                  label="Note (Optional)" 
                  value={editFormData.note} 
                  maxLength={150}
                  onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })} 
                  error={editErrors.note || (editFormData.note.length >= 150 ? "Maximum character limit reached!" : null)}
                  className="md:col-span-2" 
                />
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditingExpense(null)} disabled={isSaving}>Cancel</Button>
                <Button type="submit" variant="primary" className="bg-gradient-to-r from-teal-500 to-cyan-600" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Update Record'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>);

}