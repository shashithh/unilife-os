export const budgetCategories = [
  {
    id: 'c1',
    name: 'Food & Dining',
    color: 'bg-orange-500',
    text: 'text-orange-500',
    bgLight: 'bg-orange-100',
    badgeVariant: 'orange'
  },
  {
    id: 'c2',
    name: 'Transport',
    color: 'bg-blue-500',
    text: 'text-blue-500',
    bgLight: 'bg-blue-100',
    badgeVariant: 'blue'
  },
  {
    id: 'c3',
    name: 'Education',
    color: 'bg-purple-500',
    text: 'text-purple-500',
    bgLight: 'bg-purple-100',
    badgeVariant: 'purple'
  },
  {
    id: 'c4',
    name: 'Shopping',
    color: 'bg-teal-500',
    text: 'text-teal-500',
    bgLight: 'bg-teal-100',
    badgeVariant: 'teal'
  },
  {
    id: 'c5',
    name: 'Entertainment',
    color: 'bg-cyan-500',
    text: 'text-cyan-500',
    bgLight: 'bg-cyan-100',
    badgeVariant: 'blue'
  },
  {
    id: 'c6',
    name: 'Bills',
    color: 'bg-red-500',
    text: 'text-red-500',
    bgLight: 'bg-red-100',
    badgeVariant: 'red'
  },
  {
    id: 'c7',
    name: 'Other',
    color: 'bg-gray-500',
    text: 'text-gray-500',
    bgLight: 'bg-gray-100',
    badgeVariant: 'gray'
  }];


export const budgetSettings = {
  monthlyLimit: 45000, // LKR
  currency: 'LKR',
  warningThreshold: 80 // percentage
};

export const expenses = [
  {
    id: 'e1',
    title: 'Lunch at Campus Canteen',
    amount: 850,
    categoryId: 'c1',
    date: new Date().toISOString(),
    note: 'Rice and curry'
  },
  {
    id: 'e2',
    title: 'Bus Fare to Uni',
    amount: 120,
    categoryId: 'c2',
    date: new Date().toISOString(),
    note: ''
  },
  {
    id: 'e3',
    title: 'Printed Lecture Notes',
    amount: 1500,
    categoryId: 'c3',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    note: 'Software Engineering notes'
  },
  {
    id: 'e4',
    title: 'Grocery Shopping',
    amount: 4500,
    categoryId: 'c1',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    note: 'Snacks and essentials for dorm'
  },
  {
    id: 'e5',
    title: 'Movie Ticket',
    amount: 1200,
    categoryId: 'c5',
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    note: 'Weekend movie with friends'
  },
  {
    id: 'e6',
    title: 'Mobile Data Reload',
    amount: 999,
    categoryId: 'c6',
    date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    note: 'Monthly package'
  },
  {
    id: 'e7',
    title: 'New T-shirt',
    amount: 3500,
    categoryId: 'c4',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    note: ''
  },
  {
    id: 'e8',
    title: 'Dinner out',
    amount: 2500,
    categoryId: 'c1',
    date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    note: 'Pizza night'
  }];


// Calculate derived data for mock
export const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
export const remainingBalance = budgetSettings.monthlyLimit - totalSpent;
export const usagePercentage = Math.round(
  totalSpent / budgetSettings.monthlyLimit * 100
);

// Category breakdown
export const categorySpending = budgetCategories.
  map((cat) => {
    const spent = expenses.
      filter((e) => e.categoryId === cat.id).
      reduce((sum, e) => sum + e.amount, 0);
    return {
      ...cat,
      spent,
      percentage: totalSpent > 0 ? Math.round(spent / totalSpent * 100) : 0
    };
  }).
  sort((a, b) => b.spent - a.spent);

export const topCategory = categorySpending[0];

// Simple prediction mock
const daysInMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
).getDate();
const currentDay = new Date().getDate();
const averageDaily = totalSpent / currentDay;
export const predictedTotal = Math.round(averageDaily * daysInMonth);
export const predictionWarning = predictedTotal > budgetSettings.monthlyLimit;

export const weeklyTrendData = [
  { name: 'Week 1', spent: 12500 },
  { name: 'Week 2', spent: 8400 },
  { name: 'Week 3', spent: 15200 },
  { name: 'Week 4', spent: 4500 } // Current week
];