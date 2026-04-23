const BASE = '/api/budget';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
});

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

// Dashboard
export const getDashboardData = () => fetch(`${BASE}/dashboard`, { headers: authHeaders() }).then(handle);

// Expenses
export const getExpenses = () => fetch(`${BASE}/expenses`, { headers: authHeaders() }).then(handle);
export const getExpenseById = (id) => fetch(`${BASE}/expenses/${id}`, { headers: authHeaders() }).then(handle);
export const addExpense = (data) => fetch(`${BASE}/expenses`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(handle);
export const updateExpense = (id, data) => fetch(`${BASE}/expenses/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }).then(handle);
export const deleteExpense = (id) => fetch(`${BASE}/expenses/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle);
export const clearAllExpenses = () => fetch(`${BASE}/expenses/clear`, { method: 'DELETE', headers: authHeaders() }).then(handle);
export const getAllExpenses = getExpenses;

// Settings
export const getSettings = () => fetch(`${BASE}/settings`, { headers: authHeaders() }).then(handle);
export const updateSettings = (data) => fetch(`${BASE}/settings`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }).then(handle);
export const getMonthlyBudgets = () => fetch(`${BASE}/settings/monthly`, { headers: authHeaders() }).then(handle);
export const getMonthlyBudget = (month) => fetch(`${BASE}/settings/monthly/${month}`, { headers: authHeaders() }).then(handle);
export const setMonthlyBudget = (month, budget) => fetch(`${BASE}/settings/monthly`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ month, monthlyBudget: budget }) }).then(handle);
export const deleteMonthlyBudget = (month) => fetch(`${BASE}/settings/monthly/${month}`, { method: 'DELETE', headers: authHeaders() }).then(handle);

// Insights
export const getInsights = () => fetch(`${BASE}/insights`, { headers: authHeaders() }).then(handle);

// Alerts
export const getAlerts = () => fetch(`${BASE}/alerts`, { headers: authHeaders() }).then(handle);
