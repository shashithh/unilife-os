import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BudgetNav } from '../../components/budget/BudgetNav';
import { getExpenses, getSettings, getMonthlyBudgets, updateSettings } from '../../services/budgetApi';
import { AlertTriangle, TrendingDown, Info, Settings, CheckCircle, XCircle, X } from 'lucide-react';

export function BudgetAlerts() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(null);
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(localStorage.getItem('budgetSelectedMonth') || new Date().toISOString().slice(0, 7));

  useEffect(() => {
    localStorage.setItem('budgetSelectedMonth', selectedMonth);
  }, [selectedMonth]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState(80);
  const [muteAllAlerts, setMuteAllAlerts] = useState(false);
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [expensesData, settingsData, monthlyBudgetsRes] = await Promise.all([
          getExpenses(),
          getSettings(),
          getMonthlyBudgets()
        ]);
        setExpenses(expensesData);
        setSettings(settingsData);
        setMonthlyBudgets(monthlyBudgetsRes);
        setWarningThreshold(settingsData.warningThreshold || 80);
        setMuteAllAlerts(settingsData.muteAllAlerts || false);
        setEnableEmailAlerts(settingsData.enableEmailAlerts || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const updated = await updateSettings({
        warningThreshold: parseInt(warningThreshold),
        muteAllAlerts,
        enableEmailAlerts
      });
      setSettings(updated);
      setIsSettingsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Alerts</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Alerts & Warnings
          </h1>
          <p className="text-gray-600">
            Stay informed about your financial status.
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
          <Button variant="secondary" icon={<Settings className="w-4 h-4" />} onClick={() => setIsSettingsModalOpen(true)}>
            Alert Settings
          </Button>
        </div>
      </div>

      <BudgetNav />

      {(() => {
        if (!settings) return null;

        const getExpensesForMonth = (allExpenses, month) => {
          return allExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.toISOString().slice(0, 7) === month;
          });
        };

        const getMonthlyBudgetForMonth = (budgets, month) => {
          const budget = budgets.find(b => b.month === month);
          return budget ? budget.monthlyBudget : settings.monthlyBudget;
        };

        const monthExpenses = getExpensesForMonth(expenses, selectedMonth);
        const totalSpent = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
        const selectedBudget = getMonthlyBudgetForMonth(monthlyBudgets, selectedMonth);
        const usagePercentage = selectedBudget > 0 ? Math.round((totalSpent / selectedBudget) * 100) : 0;
        const warningThreshold = settings.warningThreshold;

        // Generate alerts locally
        const alerts = [];
        if (!settings.muteAllAlerts) {
          if (selectedBudget === 0) {
            alerts.push({
              type: "warning",
              message: "No budget set for this month. Please set a monthly budget."
            });
          } else if (usagePercentage >= 100) {
            alerts.push({
              type: "danger",
              message: "Budget exceeded"
            });
          } else if (usagePercentage >= warningThreshold) {
            alerts.push({
              type: "warning",
              message: `Warning: You have used ${usagePercentage}% of your budget`
            });
          }
        }

        const currentMonth = new Date().toISOString().slice(0, 7);
        if (!settings.muteAllAlerts && selectedMonth === currentMonth && selectedBudget > 0) {
          const currentDate = new Date();
          const currentDay = currentDate.getDate();
          const avgDailySpend = currentDay > 0 ? totalSpent / currentDay : 0;
          const predictedMonthlySpend = Math.round(avgDailySpend * 30);
          if (predictedMonthlySpend > selectedBudget) {
            alerts.push({
              type: "prediction",
              message: "At this rate, you may exceed your budget this month"
            });
          }
        }

        let statusText = 'Safe';
        let statusMessage = 'You are within budget. Good job!';
        let statusColor = 'bg-emerald-50 border-emerald-200 text-emerald-800';
        let Icon = CheckCircle;
        let iconColor = 'text-emerald-500 bg-emerald-100';

        if (selectedBudget === 0) {
          statusText = 'No Budget';
          statusMessage = 'Set a budget for tracking.';
          statusColor = 'bg-blue-50 border-blue-200 text-blue-800';
          Icon = Info;
          iconColor = 'text-blue-500 bg-blue-100';
        } else if (usagePercentage >= 100) {
          statusText = 'Danger';
          statusMessage = 'You have exceeded your budget!';
          statusColor = 'bg-rose-50 border-rose-200 text-rose-800';
          Icon = XCircle;
          iconColor = 'text-rose-500 bg-rose-100';
        } else if (usagePercentage >= warningThreshold) {
          statusText = 'Warning';
          statusMessage = 'You are close to your budget limit.';
          statusColor = 'bg-amber-50 border-amber-200 text-amber-800';
          Icon = AlertTriangle;
          iconColor = 'text-amber-500 bg-amber-100';
        }

        return (
          <>
            <Card className={`p-5 mt-4 mb-8 border-2 ${statusColor} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${iconColor}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold capitalize flex items-center gap-2">
                      {statusText === 'Safe' && '🟢'}
                      {statusText === 'Warning' && '🟡'}
                      {statusText === 'Danger' && '🔴'}
                      {statusText === 'No Budget' && 'ℹ️'}
                      {statusText} Status
                    </h3>
                    <p className="text-md opacity-90 mt-1 font-medium">{statusMessage}</p>
                  </div>
                </div>

                <div className="sm:text-right bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm self-stretch sm:self-auto flex flex-col justify-center">
                  <p className="text-sm font-semibold opacity-75 uppercase tracking-wider mb-1">Current Usage</p>
                  <div className="text-2xl font-black">
                    {usagePercentage}%
                  </div>
                </div>
              </div>

              {/* Dynamic visual progress bar inside the status card */}
              <div className="mt-4 h-2 bg-black/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${statusText === 'Safe' ? 'bg-emerald-500' :
                      statusText === 'Warning' ? 'bg-amber-500' :
                        statusText === 'No Budget' ? 'bg-blue-500' : 'bg-rose-500'
                    }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </Card>

            <div className="space-y-6">
              {alerts.length === 0 ? (
                <Card className="p-6 text-center">
                  <Info className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-gray-600">No alerts at this time. Keep up the good work!</p>
                </Card>
              ) : (
                alerts.map((alert, index) => (
                  <Card
                    key={index}
                    className={`p-4 border-l-4 ${alert.type === 'danger'
                        ? 'border-l-red-500 bg-red-50'
                        : alert.type === 'warning'
                          ? 'border-l-orange-500 bg-orange-50'
                          : 'border-l-purple-500 bg-purple-50'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3
                          className={`font-bold ${alert.type === 'danger'
                              ? 'text-red-900'
                              : alert.type === 'warning'
                                ? 'text-orange-900'
                                : 'text-purple-900'
                            }`}
                        >
                          {alert.type === 'danger' && <AlertTriangle className="w-4 h-4 inline mr-2" />}
                          {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 inline mr-2" />}
                          {alert.type === 'prediction' && <TrendingDown className="w-4 h-4 inline mr-2" />}
                          {alert.message}
                        </h3>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {alert.type === 'danger' && (
                          <Button size="sm" onClick={() => navigate('/budget/settings')} className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white border-none shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                            Adjust Budget
                          </Button>
                        )}
                        {alert.type === 'warning' && (
                          <Button size="sm" onClick={() => navigate('/budget/history')} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-none shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                            Review Spending
                          </Button>
                        )}
                        {alert.type === 'prediction' && (
                          <Button size="sm" onClick={() => navigate('/budget/insights')} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white border-none shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                            Analyze Trend
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        );
      })()}

      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-teal-600"/> Alert Settings</h2>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Warning Threshold ({warningThreshold}%)</label>
                <input 
                  type="range" 
                  min="50" max="95" 
                  value={warningThreshold} 
                  onChange={(e) => setWarningThreshold(e.target.value)}
                  className="w-full h-2 bg-gradient-to-r from-teal-400 to-red-500 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">Adjust when you start seeing "Warning" states</p>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-800">Mute Visual Alerts</h3>
                  <p className="text-xs text-gray-500 mt-1">Hide individual alert cards across the page</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={muteAllAlerts} onChange={() => setMuteAllAlerts(!muteAllAlerts)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                  <p className="text-xs text-gray-500 mt-1">Receive critical warnings via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={enableEmailAlerts} onChange={() => setEnableEmailAlerts(!enableEmailAlerts)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsSettingsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSettings} disabled={savingSettings}>{savingSettings ? 'Saving...' : 'Save Config'}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}