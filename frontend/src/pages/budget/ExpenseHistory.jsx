import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { TransactionCard } from '../../components/budget/TransactionCard';
import { budgetCategories } from '../../data/budgetMockData';
import { getExpenses, deleteExpense, updateExpense, getIncomes, deleteIncome, updateIncome } from '../../services/budgetApi';
import { Plus, Filter, Search, AlertTriangle, X } from 'lucide-react';

const incomeCategories = [
  { name: 'Salary' },
  { name: 'Freelance' },
  { name: 'Investments' },
  { name: 'Business' },
  { name: 'Gifts' },
  { name: 'Other' }
];

export function ExpenseHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'income', 'expense'

  // Edit States
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editType, setEditType] = useState('expense');
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
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [expData, incData] = await Promise.all([
        getExpenses().catch(() => []), 
        getIncomes().catch(() => [])
      ]);
      
      setExpenses(expData || []);
      setIncomes(incData || []);
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transaction, type) => {
    if (!window.confirm(`Are you sure you want to completely delete this ${type}: "${transaction.title}"?`)) return;
    try {
      setLoading(true);
      if (type === 'expense') {
        await deleteExpense(transaction._id || transaction.id);
      } else {
        await deleteIncome(transaction._id || transaction.id);
      }
      await fetchTransactions();
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (transaction, type) => {
    setEditingTransaction(transaction);
    setEditType(type);
    setEditFormData({
      title: transaction.title,
      amount: transaction.amount ? transaction.amount.toString() : '',
      categoryId: transaction.category || transaction.categoryId,
      date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
      month: transaction.month || (transaction.date ? new Date(transaction.date).toISOString().slice(0, 7) : ''),
      note: transaction.note || ''
    });
    setEditErrors({});
  };

  const validateEdit = () => {
    const newErrors = {};
    if (!editFormData.title.trim()) newErrors.title = 'Title is required';
    if (!editFormData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(editFormData.amount))) newErrors.amount = 'Must be valid number';
    else if (Number(editFormData.amount) <= 0) newErrors.amount = 'Must be strictly greater than 0';

    if (!editFormData.categoryId) newErrors.categoryId = 'Category/Source is required';
    if (!editFormData.date) newErrors.date = 'Date is required';

    if (!editFormData.month) {
      newErrors.month = 'Month is required';
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
        
        if (editType === 'expense') {
          await updateExpense(editingTransaction._id || editingTransaction.id, payload);
        } else {
          await updateIncome(editingTransaction._id || editingTransaction.id, payload);
        }
        
        setEditingTransaction(null);
        await fetchTransactions();
      } catch (err) {
        alert("Update failed: " + err.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Combine and map types
  let allTransactions = [
    ...(expenses || []).map(e => ({ ...e, type: 'expense' })),
    ...(incomes || []).map(i => ({ ...i, type: 'income' }))
  ];

  if (activeTab === 'expense') allTransactions = allTransactions.filter(t => t.type === 'expense');
  if (activeTab === 'income') allTransactions = allTransactions.filter(t => t.type === 'income');

  const filteredTransactions = allTransactions
    .filter((tx) => {
      const matchesSearch =
        tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesCategory = filterCategory ?
        (tx.category === filterCategory || tx.categoryId === filterCategory) :
        true;

      let matchesFrom = true;
      let matchesTo = true;

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        const txDate = new Date(tx.date);
        matchesFrom = txDate >= from;
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        const txDate = new Date(tx.date);
        matchesTo = txDate <= to;
      }

      return matchesSearch && matchesCategory && matchesFrom && matchesTo;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest')
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

  if (loading && expenses.length === 0 && incomes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600">
            View and manage all your past income and expenses securely.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="bg-gradient-to-r from-emerald-500 to-green-600"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/budget/add-income')}>
            Add Income
          </Button>
          <Button
            variant="primary"
            className="bg-gradient-to-r from-teal-500 to-cyan-600"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/budget/add')}>
            Add Expense
          </Button>
        </div>
      </div>

      <BudgetNav />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl w-full md:w-fit">
        <button 
          onClick={() => setActiveTab('all')} 
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          All Records
        </button>
        <button 
          onClick={() => setActiveTab('income')} 
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Income Only
        </button>
        <button 
          onClick={() => setActiveTab('expense')} 
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Expenses Only
        </button>
      </div>

      <Card className="p-4 mb-8 flex flex-col md:flex-row gap-4 items-end bg-white/50">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="w-full md:w-36">
          <Input type="date" label="From" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="!gap-0" />
        </div>
        <div className="w-full md:w-36">
          <Input type="date" label="To" value={toDate} onChange={(e) => setToDate(e.target.value)} className="!gap-0" />
        </div>
        <div className="w-full md:w-48">
          <Input
            as="select"
            label=""
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: '', label: 'All Categories/Sources' },
              ...budgetCategories.map(c => ({ value: c.name, label: c.name })),
              // Since we are showing both, provide income categories too in the filter dropdown
              ...incomeCategories.map(c => ({ value: c.name, label: c.name }))
            ]}
            className="!gap-0" />
        </div>
        <div className="w-full md:w-48">
          <Input
            as="select"
            label=""
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'highest', label: 'Highest Amount' },
              { value: 'lowest', label: 'Lowest Amount' }
            ]}
            className="!gap-0" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTransactions.map((tx) =>
          <TransactionCard key={tx._id || tx.id} transaction={tx} type={tx.type} onEdit={handleEditOpen} onDelete={handleDelete} />
        )}

        {filteredTransactions.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            <p className="text-lg font-medium text-gray-900 mb-1">
              No records found
            </p>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {editingTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className={`max-w-2xl w-full p-6 animate-fade-in shadow-2xl overflow-y-auto max-h-[90vh] border-t-4 ${editType === 'income' ? 'border-t-emerald-500' : 'border-t-teal-500'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Edit {editType === 'income' ? 'Income' : 'Expense'}
              </h2>
              <button onClick={() => setEditingTransaction(null)} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Title" value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} error={editErrors.title} className="md:col-span-2" />
                
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
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value.replace(/-/g, '') })} 
                    error={editErrors.amount} 
                  />
                </div>
                
                <Input 
                  as="select" 
                  label={editType === 'income' ? 'Source' : 'Category'} 
                  value={editFormData.categoryId} 
                  onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })} 
                  error={editErrors.categoryId} 
                  options={
                    editType === 'income' 
                    ? incomeCategories.map((c) => ({ value: c.name, label: c.name }))
                    : budgetCategories.map((c) => ({ value: c.name, label: c.name }))
                  } 
                />
                <Input type="date" label="Date" value={editFormData.date} onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })} error={editErrors.date} />
                <Input type="month" label="Month" value={editFormData.month} onChange={(e) => setEditFormData({ ...editFormData, month: e.target.value })} error={editErrors.month} />
                
                <Input 
                  as="textarea" 
                  label="Note (Optional)" 
                  value={editFormData.note} 
                  maxLength={150}
                  onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })} 
                  error={editErrors.note || ((editFormData.note && editFormData.note.length >= 150) ? "Maximum character limit reached!" : null)}
                  className="md:col-span-2" 
                />
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditingTransaction(null)} disabled={isSaving}>Cancel</Button>
                <Button type="submit" variant="primary" className={`border-none ${editType === 'income' ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30' : 'bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/30'}`} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Update Record'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}