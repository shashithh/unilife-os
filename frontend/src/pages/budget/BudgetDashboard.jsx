import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { ExpenseCard } from '../../components/budget/ExpenseCard';
import {
  getDashboardData,
  getInsights,
  getSettings,
  getExpenses,
  getMonthlyBudgets
} from '../../services/budgetApi';
import {
  Plus,
  Wallet,
  TrendingDown,
  AlertTriangle,
  PieChart,
  ArrowRight,
  Sparkles
} from
  'lucide-react';
export function BudgetDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(localStorage.getItem('budgetSelectedMonth') || new Date().toISOString().slice(0, 7));

  useEffect(() => {
    localStorage.setItem('budgetSelectedMonth', selectedMonth);
  }, [selectedMonth]);

  // Filter expenses by selected month
  const getExpensesForMonth = (expenses, month) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.toISOString().slice(0, 7);
      return expenseMonth === month;
    });
  };

  // Get monthly budget for selected month
  const getMonthlyBudgetForMonth = (budgets, month) => {
    const budget = budgets.find(b => b.month === month);
    return budget ? budget.monthlyBudget : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dashboard, insights, settingsRes, expensesRes, monthlyBudgetsRes] = await Promise.all([
          getDashboardData(),
          getInsights(),
          getSettings(),
          getExpenses(),
          getMonthlyBudgets()
        ]);

        setDashboardData(dashboard);
        setInsightsData(insights);
        setSettings(settingsRes);
        setAllExpenses(expensesRes);
        setMonthlyBudgets(monthlyBudgetsRes);
        setRecentExpenses(expensesRes.slice(0, 5)); // Keep recent expenses for reference
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update data when month changes
  useEffect(() => {
    if (allExpenses.length > 0) {
      const monthExpenses = getExpensesForMonth(allExpenses, selectedMonth);
      setRecentExpenses(monthExpenses.slice(0, 5));
    }
  }, [selectedMonth, allExpenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentMonthName = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getSelectedMonthName = () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!dashboardData || !insightsData || !settings) {
    return null;
  }

  // Filter data for selected month
  const monthExpenses = getExpensesForMonth(allExpenses, selectedMonth);
  const selectedMonthlyBudget = getMonthlyBudgetForMonth(monthlyBudgets, selectedMonth);
  const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = selectedMonthlyBudget - totalSpent;
  const monthlyBudget = dashboardData.monthlyBudget;
  const usagePercentage = Math.round((totalSpent / selectedMonthlyBudget) * 100);
  const predictedTotal = insightsData.predictedMonthlySpend;
  const predictionWarning = predictedTotal > selectedMonthlyBudget;

  // Calculate top category from month expenses (simplified)
  const categorySpend = {};
  monthExpenses.forEach(exp => {
    categorySpend[exp.category] = (categorySpend[exp.category] || 0) + exp.amount;
  });
  const topCategoryName = Object.keys(categorySpend).reduce((a, b) =>
    categorySpend[a] > categorySpend[b] ? a : b, 'None'
  );
  const topCategorySpent = categorySpend[topCategoryName] || 0;
  const topCategoryPercentage = totalSpent > 0 ? Math.round((topCategorySpent / totalSpent) * 100) : 0;

  const topCategory = {
    name: topCategoryName,
    spent: topCategorySpent,
    percentage: topCategoryPercentage
  };

  const isWarning = usagePercentage >= settings.warningThreshold;
  const isCritical = usagePercentage >= 100;
  let progressColor = 'bg-teal-500';
  if (isCritical) progressColor = 'bg-red-500';
  else if (isWarning) progressColor = 'bg-orange-500';

  // Strict Mode logic
  const isStrictCritical = isCritical && settings.strictMode;
  const mainCardClasses = isStrictCritical
    ? "p-6 bg-gradient-to-br from-red-950 to-red-900 text-white border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] relative overflow-hidden"
    : "p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl relative overflow-hidden";

  const isPredictStrict = predictionWarning && settings.strictMode;
  const predictionCardClasses = isPredictStrict
    ? "p-5 bg-red-50 border-l-4 border-l-red-600 shadow-sm"
    : "p-5 border-l-4 border-l-purple-500";

  // Micro-budgets logic
  const categoryBudgets = settings.categoryBudgets || {};
  const activeMicroBudgets = Object.keys(categoryBudgets)
    .filter(k => categoryBudgets[k] > 0)
    .map(cat => {
      const limit = parseInt(categoryBudgets[cat]);
      const spent = monthExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
      const usage = Math.min((spent / limit) * 100, 100);
      return { category: cat, spent, limit, usage };
    });
  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Budget Assistant
          </h1>
          <p className="text-gray-600">
            Track your spending and manage your finances smartly.
          </p>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Select Month</label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={<PieChart className="w-4 h-4" />}
              onClick={() => navigate('/budget/insights')}>

              Insights
            </Button>
            <Button
              variant="primary"
              className="bg-gradient-to-r from-teal-500 to-cyan-600"
              icon={<Wallet className="w-4 h-4" />}
              onClick={() => navigate('/budget/monthly-budget')}>

              Set Monthly Budget
            </Button>
            <Button
              variant="primary"
              className="bg-gradient-to-r from-teal-500 to-cyan-600"
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
      </div>

      <BudgetNav />

      {/* Warning Banner if needed */}
      {isWarning && !isCritical &&
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3 text-orange-800 animate-slide-up">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Budget Warning</h4>
            <p className="text-sm mt-1">
              You have used {usagePercentage}% of your budget. Try to
              minimize non-essential expenses.
            </p>
          </div>
        </div>
      }

      {isCritical &&
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 animate-slide-up">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Budget Exceeded!</h4>
            <p className="text-sm mt-1">
              You have exceeded your budget by{' '}
              {formatCurrency(Math.abs(remainingBalance))}.
            </p>
          </div>
        </div>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* No Budget Warning */}
          {selectedMonthlyBudget === 0 && (
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    No Budget Set for {getSelectedMonthName()}
                  </h3>
                  <p className="text-amber-700 mb-4">
                    You haven't set a monthly budget for {getSelectedMonthName()}.
                    Set a budget to track your spending and get insights.
                  </p>
                  <Button
                    variant="primary"
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => navigate('/budget/monthly-budget', {
                      state: { selectedMonth, prefillAmount: '' }
                    })}
                  >
                    Set Monthly Budget
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Main Budget Card */}
          <Card className={mainCardClasses}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-slate-400 font-medium mb-1">
                    Total Balance Remaining for {getSelectedMonthName()}
                  </p>
                  <h2
                    className={`text-4xl font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>

                    {selectedMonthlyBudget > 0 ? formatCurrency(remainingBalance) : formatCurrency(totalSpent)}
                  </h2>
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Wallet className="w-6 h-6 text-teal-400" />
                </div>
              </div>

              {selectedMonthlyBudget > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-300">
                      Spent: {formatCurrency(totalSpent)}
                    </span>
                    <span className="text-slate-300">
                      Budget: {formatCurrency(selectedMonthlyBudget)}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-teal-500'
                        }`}
                      style={{
                        width: `${Math.min(usagePercentage, 100)}%`
                      }}>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{usagePercentage}% Used</span>
                    <span>
                      {remainingBalance >= 0
                        ? `${formatCurrency(remainingBalance)} remaining`
                        : `${formatCurrency(Math.abs(remainingBalance))} over budget`
                      }
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-300">
                      Total Spent: {formatCurrency(totalSpent)}
                    </span>
                    <span className="text-slate-300">
                      No Budget Set
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    Set a monthly budget to see progress tracking
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Smart Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={predictionCardClasses}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h3 className="font-bold text-gray-900">Spending Prediction</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(predictedTotal)}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Estimated total by month end
              </p>
              {predictionWarning ?
                <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded-lg">
                  At this rate, you may exceed your budget this month.
                </p> :

                <p className="text-xs font-medium text-green-600 bg-green-50 p-2 rounded-lg">
                  You are on track to stay within budget.
                </p>
              }
            </Card>

            <Card className="p-5 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-gray-900">Top Category</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {topCategory.name}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {formatCurrency(topCategory.spent)} ({topCategory.percentage}%)
              </p>
              <p className="text-xs font-medium text-orange-700 bg-orange-50 p-2 rounded-lg">
                Try reducing {topCategory.name} expenses to save more.
              </p>
            </Card>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Micro-Budgets */}
          {activeMicroBudgets.length > 0 && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Micro-Budgets
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/budget/settings')}>

                  Manage
                </Button>
              </div>
              <div className="space-y-4">
                {activeMicroBudgets.slice(0, 3).map((budget) => {
                  const isOverBudget = budget.spent > budget.limit;
                  const progressColor = isOverBudget ? 'bg-red-500' : budget.usage > 80 ? 'bg-orange-500' : 'bg-green-500';

                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-700">{budget.category}</span>
                        <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
                          style={{
                            width: `${Math.min(budget.usage, 100)}%`
                          }}>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-right">
                        {Math.round(budget.usage)}% Used
                      </p>
                    </div>
                  );
                })}
              </div>
              {activeMicroBudgets.length > 3 && (
                <Button
                  variant="secondary"
                  className="w-full mt-4"
                  onClick={() => navigate('/budget/settings')}>

                  View All Micro-Budgets
                </Button>
              )}
            </Card>
          )}

          {/* Monthly Budgets */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Monthly Budgets
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/budget/monthly-budget')}>

                Manage
              </Button>
            </div>

            {/* Selected Month Budget Status */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-blue-900">{getSelectedMonthName()}</p>
                  <p className="text-sm text-blue-700">
                    {selectedMonthlyBudget > 0
                      ? `Budget: ${formatCurrency(selectedMonthlyBudget)}`
                      : 'No budget set'
                    }
                  </p>
                </div>
                {selectedMonthlyBudget === 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/budget/monthly-budget', {
                      state: { selectedMonth, prefillAmount: '' }
                    })}
                  >
                    Set Budget
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {monthlyBudgets.slice(0, 3).map((budget) => {
                const isSelectedMonth = budget.month === selectedMonth;
                return (
                  <div
                    key={budget.month}
                    className={`flex justify-between items-center p-3 rounded-lg border ${isSelectedMonth
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div>
                      <p className={`font-medium ${isSelectedMonth ? 'text-blue-900' : 'text-gray-900'}`}>
                        {budget.month}
                      </p>
                      <p className={`text-sm ${isSelectedMonth ? 'text-blue-700' : 'text-gray-600'}`}>
                        Budget {isSelectedMonth && '(Current)'}
                      </p>
                    </div>
                    <p className={`font-semibold ${isSelectedMonth ? 'text-blue-900' : 'text-gray-900'}`}>
                      {formatCurrency(budget.monthlyBudget)}
                    </p>
                  </div>
                );
              })}
              {monthlyBudgets.length === 0 && (
                <p className="text-gray-500 text-center py-4">No monthly budgets set yet.</p>
              )}
            </div>
            {monthlyBudgets.length > 3 && (
              <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => navigate('/budget/monthly-budget')}>

                View All Monthly Budgets
              </Button>
            )}
          </Card>

          {/* Recent Expenses */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Expenses
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/budget/history')}>

                View All
              </Button>
            </div>
            <div className="space-y-1">
              {recentExpenses.map((expense) =>
                <ExpenseCard key={expense._id} expense={expense} compact />
              )}
            </div>
            <Button
              variant="secondary"
              className="w-full mt-4"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/budget/history')}>

              See Full History
            </Button>
          </Card>
        </div>
      </div>
    </div>);

}