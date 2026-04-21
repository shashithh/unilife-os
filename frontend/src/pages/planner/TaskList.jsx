import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { TaskCard } from '../../components/planner/TaskCard';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { Plus, Filter, Search } from 'lucide-react';

export function TaskList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch('/api/subjects')
      .then((res) => res.json())
      .then(setSubjects)
      .catch((err) => console.error('Error fetching subjects:', err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (filterSubject) params.append('subjectId', filterSubject);
    if (filterPriority) params.append('priority', filterPriority);

    fetch(`/api/tasks?${params.toString()}`)
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error('Error fetching tasks:', err));
  }, [searchTerm, filterSubject, filterPriority]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };
  const filteredTasks = tasks;
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
          onClick={() => navigate('/planner/add-task')}>
          
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
              value: s._id,
              label: s.subjectName
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
        <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
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