const API_BASE_URL = '/api/budget';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Dashboard API
export const getDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  return handleResponse(response);
};

export const getAllExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  return handleResponse(response);
};

// Expenses API
export const getExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  return handleResponse(response);
};

export const getExpenseById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`);
  return handleResponse(response);
};

export const addExpense = async (expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });
  return handleResponse(response);
};

export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });
  return handleResponse(response);
};

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const clearAllExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses/clear`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Settings API
export const getSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/settings`);
  return handleResponse(response);
};

export const updateSettings = async (settingsData) => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settingsData),
  });
  return handleResponse(response);
};

export const getMonthlyBudgets = async () => {
  const response = await fetch(`${API_BASE_URL}/settings/monthly`);
  return handleResponse(response);
};

export const getMonthlyBudget = async (month) => {
  const response = await fetch(`${API_BASE_URL}/settings/monthly/${month}`);
  return handleResponse(response);
};

export const setMonthlyBudget = async (month, budget) => {
  const response = await fetch(`${API_BASE_URL}/settings/monthly`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ month, monthlyBudget: budget }),
  });
  return handleResponse(response);
};

export const deleteMonthlyBudget = async (month) => {
  const response = await fetch(`${API_BASE_URL}/settings/monthly/${month}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Insights API
export const getInsights = async () => {
  const response = await fetch(`${API_BASE_URL}/insights`);
  return handleResponse(response);
};

// Alerts API
export const getAlerts = async () => {
  const response = await fetch(`${API_BASE_URL}/alerts`);
  return handleResponse(response);
};