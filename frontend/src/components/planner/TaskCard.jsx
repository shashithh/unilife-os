import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RiskBadge } from './RiskBadge';
import { Clock, Calendar, CheckCircle2, MoreVertical } from 'lucide-react';

export function TaskCard({ task, onStatusChange }) {
  const subject = task.subjectId; // Populated from backend
  const deadlineDate = new Date(task.deadline);
  const isOverdue = deadlineDate < new Date() && task.status !== 'Completed';

  const priorityColors = {
    High: 'red',
    Medium: 'orange',
    Low: 'green'
  };

  return (
    <Card hover className="p-4 relative group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center">
          <Badge className={`bg-gray-100 text-gray-800 border-none`}>
            {subject?.subjectCode || 'N/A'}
          </Badge>

          <Badge variant={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>

        <button 
          className="text-gray-400 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Mark complete / incomplete"
          onClick={() => onStatusChange && onStatusChange(task._id, task.status === 'Completed' ? 'Pending' : 'Completed')}
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>

      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
        {task.title}
      </h3>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-between text-sm">
          <div
            className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
              }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              {deadlineDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedHours}h</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
          <RiskBadge level={task.risk} />

          {task.status === 'Completed' ? (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <CheckCircle2 className="w-4 h-4" /> Done
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-500">
              {task.status}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}