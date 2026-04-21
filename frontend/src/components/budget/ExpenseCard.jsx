import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { budgetCategories } from '../../data/budgetMockData';
import { Calendar, Edit2, Trash2, MoreVertical } from 'lucide-react';

export function ExpenseCard({ expense, compact = false, onEdit, onDelete }) {
  const category = budgetCategories.find((c) => c.id === expense.categoryId);
  const date = new Date(expense.date);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${category?.bgLight} ${category?.text} flex items-center justify-center font-bold text-sm`}>

            {category?.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {expense.title}
            </p>
            <p className="text-xs text-gray-500">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">
            {formatCurrency(expense.amount)}
          </p>
          <Badge
            variant={category?.badgeVariant}
            className="mt-1 !text-[10px] !px-1.5 !py-0">

            {category?.name}
          </Badge>
        </div>
      </div>);

  }
  return (
    <Card hover className="p-4 relative group">
      <div className="flex justify-between items-start mb-3">
        <Badge variant={category?.badgeVariant}>{category?.name}</Badge>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit && onEdit(expense)} className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete && onDelete(expense)} className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
        {expense.title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 mb-3">
        {formatCurrency(expense.amount)}
      </p>

      {expense.note &&
        <p className="text-sm text-gray-500 mb-3 line-clamp-1 italic">
          "{expense.note}"
        </p>
      }

      <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
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
    </Card>);

}