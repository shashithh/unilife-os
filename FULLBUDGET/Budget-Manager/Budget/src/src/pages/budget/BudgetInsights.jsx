import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { getInsights, getExpenses, getMonthlyBudgets } from '../../services/budgetApi';
import { budgetCategories } from '../../data/budgetMockData';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from
  'recharts';
import { TrendingDown, Lightbulb, Target, AlertTriangle } from 'lucide-react';
export function BudgetInsights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(localStorage.getItem('budgetSelectedMonth') || new Date().toISOString().slice(0, 7));

  useEffect(() => {
    localStorage.setItem('budgetSelectedMonth', selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [insights, expensesData, monthlyBudgetsRes] = await Promise.all([
          getInsights(),
          getExpenses(),
          getMonthlyBudgets()
        ]);
        setInsightsData(insights);
        setExpenses(expensesData);
        setMonthlyBudgets(monthlyBudgetsRes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Insights</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!insightsData) return null;

  // Filter expenses by selected month
  const getExpensesForMonth = (allExpenses, month) => {
    return allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.toISOString().slice(0, 7) === month;
    });
  };

  const getMonthlyBudgetForMonth = (budgets, month) => {
    const budget = budgets.find(b => b.month === month);
    return budget ? budget.monthlyBudget : insightsData.monthlyBudget;
  };

  const monthExpenses = getExpensesForMonth(expenses, selectedMonth);
  const totalSpent = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const budgetSettings = { monthlyLimit: getMonthlyBudgetForMonth(monthlyBudgets, selectedMonth) };

  // Calculate category spending
  const categoryMap = {};
  monthExpenses.forEach((exp) => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
  });

  const categorySpending = budgetCategories.map((cat) => {
    const spent = categoryMap[cat.name] || 0;
    return {
      ...cat,
      spent,
      percentage: totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0
    };
  }).sort((a, b) => b.spent - a.spent);

  const topCategory = categorySpending[0] || { name: 'None', spent: 0, percentage: 0 };

  // dynamic weekly trend
  const weeks = [
    { name: 'Week 1', spent: 0 },
    { name: 'Week 2', spent: 0 },
    { name: 'Week 3', spent: 0 },
    { name: 'Week 4', spent: 0 },
    { name: 'Week 5', spent: 0 }
  ];

  monthExpenses.forEach(exp => {
    const d = new Date(exp.date);
    const date = d.getDate();
    const weekIdx = Math.min(Math.floor((date - 1) / 7), 4);
    weeks[weekIdx].spent += exp.amount;
  });

  const weeklyTrendData = weeks[4].spent === 0 && weeks[3].spent === 0 ? weeks.slice(0, 4) : weeks;
  // Map tailwind colors to hex for recharts
  const colorMap = {
    'bg-orange-500': '#f97316',
    'bg-blue-500': '#3b82f6',
    'bg-purple-500': '#8b5cf6',
    'bg-teal-500': '#14b8a6',
    'bg-cyan-500': '#06b6d4',
    'bg-red-500': '#ef4444',
    'bg-gray-500': '#6b7280'
  };
  const pieData = categorySpending.
    filter((c) => c.spent > 0).
    map((c) => ({
      name: c.name,
      value: c.spent,
      color: colorMap[c.color] || '#cbd5e1'
    }));
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Insights & Analytics
          </h1>
          <p className="text-gray-600">
            Understand your spending habits to save more.
          </p>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Select Month</label>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      <BudgetNav />

      {/* Smart Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100">
          <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">
            Total Monthly Spending
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Out of {formatCurrency(budgetSettings.monthlyLimit)} limit
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">
            Top Spending Category
          </p>
          <p className="text-3xl font-bold text-gray-900">{topCategory.name}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatCurrency(topCategory.spent)} ({topCategory.percentage}% of
            total)
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">
            Smart Suggestion
          </p>
          <p className="text-sm font-bold text-gray-900 mt-2">
            Your {topCategory.name} expenses are unusually high this month. Try
            cooking at home or packing lunch to save approximately{' '}
            {formatCurrency(topCategory.spent * 0.3)} next week.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Category Distribution
          </h3>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value">

                  {pieData.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />

              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-3 max-h-64 overflow-y-auto pr-2">
              {categorySpending.
                filter((c) => c.spent > 0).
                map((cat, idx) =>
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: colorMap[cat.color]
                      }}>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-500">{cat.percentage}%</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(cat.spent)}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </Card>

        {/* Weekly Trend Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Weekly Spending Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb" />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#6b7280',
                    fontSize: 12
                  }}
                  dy={10} />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#6b7280',
                    fontSize: 12
                  }}
                  tickFormatter={(val) => `Rs.${val / 1000}k`} />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    'Spent']
                  }
                  cursor={{
                    fill: '#f3f4f6'
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />

                <Bar dataKey="spent" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>);

}