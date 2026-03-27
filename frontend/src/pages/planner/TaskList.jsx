import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { TaskCard } from '../../components/planner/TaskCard';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { tasks, subjects } from '../../data/mockData';
import { Plus, Filter, Search } from 'lucide-react';
export function TaskList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.
    toLowerCase().
    includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject ?
    task.subjectId === filterSubject :
    true;
    const matchesPriority = filterPriority ?
    task.priority === filterPriority :
    true;
    return matchesSearch && matchesSubject && matchesPriority;
  });
  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
          <p className="text-gray-600">
            Manage and track all your academic assignments.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/add-task')}>
          
          Add Task
        </Button>
      </div>

      <PlannerNav />

      <Card className="p-4 mb-8 flex flex-col md:flex-row gap-4 items-end bg-white/50">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          
        </div>
        <div className="w-full md:w-48">
          <Input
            as="select"
            label=""
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            options={[
            {
              value: '',
              label: 'All Subjects'
            },
            ...subjects.map((s) => ({
              value: s.id,
              label: s.name
            }))]
            }
            className="!gap-0" />
          
        </div>
        <div className="w-full md:w-48">
          <Input
            as="select"
            label=""
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
            {
              value: '',
              label: 'All Priorities'
            },
            {
              value: 'High',
              label: 'High Priority'
            },
            {
              value: 'Medium',
              label: 'Medium Priority'
            },
            {
              value: 'Low',
              label: 'Low Priority'
            }]
            }
            className="!gap-0" />
          
        </div>
        <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
          More Filters
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) =>
        <TaskCard key={task.id} task={task} />
        )}

        {filteredTasks.length === 0 &&
        <div className="col-span-full py-12 text-center text-gray-500">
            <p className="text-lg font-medium text-gray-900 mb-1">
              No tasks found
            </p>
            <p>Try adjusting your search or filters.</p>
          </div>
        }
      </div>
    </div>);

}