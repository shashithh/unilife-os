import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { getSettings, updateSettings, clearAllExpenses, getExpenses, getMonthlyBudgets } from '../../services/budgetApi';
import { budgetCategories } from '../../data/budgetMockData';
import { CheckCircle2, Save, AlertTriangle, Settings2, Grid, Database, Trash2, Download } from 'lucide-react';

export function BudgetSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // General Limits
  const [warningThreshold, setWarningThreshold] = useState('80');
  const [strictMode, setStrictMode] = useState(false);
  const [monthlyBudgetsList, setMonthlyBudgetsList] = useState([]);

  // Micro Budgets
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [categorySpending, setCategorySpending] = useState({});

  // Reset Confirm logic
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const [settingsData, expensesData, mbData] = await Promise.all([
          getSettings(),
          getExpenses(),
          getMonthlyBudgets()
        ]);
        
        setWarningThreshold(settingsData.warningThreshold?.toString() || '80');
        setStrictMode(settingsData.strictMode || false);
        setCategoryBudgets(settingsData.categoryBudgets || {});
        setMonthlyBudgetsList(mbData || []);
        
        // Calculate current spending per category
        const spending = {};
        expensesData.forEach(expense => {
          spending[expense.category] = (spending[expense.category] || 0) + expense.amount;
        });
        setCategorySpending(spending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSettings({
        warningThreshold: parseInt(warningThreshold),
        strictMode,
        categoryBudgets
      });
      setSuccessMessage('Settings updated successfully!');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (catName, val) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [catName]: val === '' ? 0 : parseInt(val)
    }));
  };

  const clearCategoryBudget = (catName) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [catName]: 0
    }));
  };

  const setCategoryPreset = (catName, amount) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [catName]: amount
    }));
  };

  const handleExportCSV = async () => {
    try {
      setSaving(true);
      const expenses = await getExpenses();
      if (!expenses || expenses.length === 0) {
        throw new Error("No expenses to export.");
      }
      
      const headers = "Date,Title,Category,Amount\n";
      const rows = expenses.map(e => `${new Date(e.date).toLocaleDateString()},"${e.title}",${e.category},${e.amount}`).join('\n');
      const csv = headers + rows;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'budget_history.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccessMessage('Data exported successfully!');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    try {
      setResetting(true);
      await clearAllExpenses();
      setSuccessMessage('All expense data permanently deleted!');
      setIsSuccess(true);
      setShowConfirm(false);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Settings</h1>
        <p className="text-gray-600">Configure your limits, logic, and data preferences.</p>
      </div>

      <BudgetNav />

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {error && !isSuccess && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto underline text-sm border p-1 border-red-300 rounded">Dismiss</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        
        {/* Left Nav Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${activeTab === 'general' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings2 className="w-5 h-5" /> General Limits
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${activeTab === 'categories' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Grid className="w-5 h-5" /> Micro-Budgets
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${activeTab === 'data' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Database className="w-5 h-5" /> Data & Backup
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card className="p-8 animate-fade-in border-t-4 border-t-teal-500">
              <h2 className="text-xl font-bold mb-6">General Limits & Logic</h2>
              <form onSubmit={handleSave} className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-semibold text-gray-800">Monthly Budgets</h3>
                     <Button type="button" variant="secondary" size="sm" onClick={() => navigate('/budget/monthly-budget')}>Manage Budgets</Button>
                  </div>
                  {monthlyBudgetsList.length > 0 ? (
                    <div className="space-y-2">
                       {monthlyBudgetsList.slice(0, 3).map(mb => (
                          <div key={mb.month} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                             <span className="font-medium text-gray-700">{mb.month}</span>
                             <span className="font-bold text-gray-900">{formatCurrency(mb.monthlyBudget)}</span>
                          </div>
                       ))}
                       {monthlyBudgetsList.length > 3 && (
                          <p className="text-sm text-gray-500 text-center mt-2">... and {monthlyBudgetsList.length - 3} more</p>
                       )}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                      <p className="text-gray-500">No monthly budgets configured yet.</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Warning Threshold ({warningThreshold}%)</h3>
                        <p className="text-sm text-gray-500">When should we warn you about your spending?</p>
                      </div>
                    </div>
                    
                    <input 
                      type="range" 
                      min="50" 
                      max="95" 
                      value={warningThreshold} 
                      onChange={(e) => setWarningThreshold(e.target.value)}
                      className="w-full h-2 bg-gradient-to-r from-teal-400 via-orange-400 to-red-500 rounded-lg appearance-none cursor-pointer mt-4 mb-4"
                    />

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Alert Preview</p>
                      <div className="flex items-start gap-3 text-orange-700 bg-orange-100/50 p-3 rounded-lg border border-orange-200">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm">Warning: Budget limit approaching!</p>
                          <p className="text-sm">You have crossed {warningThreshold}% of your standard budget. Time to slow down.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Strict Mode</h3>
                      <p className="text-sm text-gray-500">Turn UI into forceful warnings when hitting limits.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={strictMode} onChange={() => setStrictMode(!strictMode)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <Button type="submit" variant="primary" icon={<Save className="w-4 h-4"/>} disabled={saving}>
                    {saving ? 'Saving...' : 'Save General Settings'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'categories' && (
            <Card className="p-8 animate-fade-in border-t-4 border-t-purple-500">
              <h2 className="text-xl font-bold mb-2">Micro-Budgets</h2>
              <p className="text-gray-600 text-sm mb-6">Assign specific limits to your expense categories. Keep empty for standard unlimited status.</p>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {budgetCategories.map(cat => {
                    const currentSpent = categorySpending[cat.name] || 0;
                    const budgetLimit = categoryBudgets[cat.name] || 0;
                    const isOverBudget = budgetLimit > 0 && currentSpent > budgetLimit;
                    const usagePercent = budgetLimit > 0 ? Math.min((currentSpent / budgetLimit) * 100, 100) : 0;
                    
                    return (
                      <div key={cat.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md">
                        <div className="flex gap-4 items-start">
                          <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-purple-600">
                            <cat.icon className="w-6 h-6"/>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-gray-800">{cat.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Spent: <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formatCurrency(currentSpent)}
                                  </span>
                                  {budgetLimit > 0 && (
                                    <span className="text-gray-500"> / {formatCurrency(budgetLimit)}</span>
                                  )}
                                </p>
                              </div>
                              {budgetLimit > 0 && (
                                <button
                                  type="button"
                                  onClick={() => clearCategoryBudget(cat.name)}
                                  className="text-xs text-red-600 hover:text-red-800 underline"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            
                            {budgetLimit > 0 && (
                              <div className="mb-3">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isOverBudget ? 'bg-red-500' : usagePercent > 80 ? 'bg-orange-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${usagePercent}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 text-right mt-1">
                                  {Math.round(usagePercent)}% Used
                                </p>
                              </div>
                            )}
                            
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-medium text-sm">LKR</span>
                                  <input 
                                    type="number"
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-12 pr-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                    value={categoryBudgets[cat.name] || ''}
                                    onChange={(e) => handleCategoryChange(cat.name, e.target.value)}
                                    placeholder="Unlimited"
                                    min="0"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setCategoryPreset(cat.name, 5000)}
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                >
                                  5K
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCategoryPreset(cat.name, 10000)}
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                >
                                  10K
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCategoryPreset(cat.name, 25000)}
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                >
                                  25K
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white" icon={<Save className="w-4 h-4"/>} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Micro-Budgets'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'data' && (
            <Card className="p-8 animate-fade-in border-t-4 border-t-blue-500">
              <h2 className="text-xl font-bold mb-6">Data & Backup</h2>

              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">Export Data</h3>
                <p className="text-sm text-blue-800 mb-4">Download a complete CSV record of all your expenses for external backup or analysis.</p>
                <div className="inline-block">
                  <Button type="button" variant="primary" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90" icon={<Download className="w-4 h-4"/>} onClick={handleExportCSV} disabled={saving}>
                    Download CSV
                  </Button>
                </div>
              </div>

              <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Danger Zone</h3>
                <p className="text-sm text-red-800 mb-4">Resetting your data permanently deletes all expense history. This action cannot be undone.</p>
                
                {!showConfirm ? (
                   <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700 text-white hover:opacity-90" icon={<Trash2 className="w-4 h-4"/>} onClick={() => setShowConfirm(true)}>
                    Reset All Data
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700" onClick={handleResetData} disabled={resetting}>
                      {resetting ? 'Deleting...' : 'Yes, Delete Everything'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}