import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { budgetCategories } from '../../data/budgetMockData';
import { Calendar, Edit2, Trash2 } from 'lucide-react';

export function TransactionCard({ transaction, type = 'expense', onEdit, onDelete }) {
  // Try to find matching category for expenses, or use a default for income
  let category = budgetCategories.find((c) => c.id === transaction.categoryId || c.name === transaction.category);
  
  if (!category) {
    // Default styling for unmatched or income categories
    const isIncome = type === 'income';
    category = {
      name: transaction.category || 'Other',
      badgeVariant: isIncome ? 'green' : 'gray',
      bgLight: isIncome ? 'bg-emerald-100' : 'bg-gray-100',
      text: isIncome ? 'text-emerald-600' : 'text-gray-600'
    };
  }

  const date = new Date(transaction.date);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isIncome = type === 'income';
  const amountSign = isIncome ? '+' : '-';
  const amountColor = isIncome ? 'text-emerald-600' : 'text-gray-900';

  return (
    <Card hover className="p-4 relative group border-l-4 border-l-transparent transition-all hover:border-l-current" style={{ borderLeftColor: isIncome ? '#10b981' : 'transparent' }}>
      <div className="flex justify-between items-start mb-3">
        <Badge variant={category?.badgeVariant || (isIncome ? 'green' : 'gray')}>{category?.name}</Badge>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit && onEdit(transaction, type)} className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete && onDelete(transaction, type)} className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
        {transaction.title}
      </h3>
      <p className={`text-2xl font-bold mb-3 ${amountColor}`}>
        {amountSign}{formatCurrency(transaction.amount)}
      </p>

      {transaction.note &&
        <p className="text-sm text-gray-500 mb-3 line-clamp-1 italic">
          "{transaction.note}"
        </p>
      }

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </div>
    </Card>
  );
}
