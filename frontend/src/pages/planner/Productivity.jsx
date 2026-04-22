import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { PlannerNav } from '../../components/planner/PlannerNav';
import { TrendingUp, Clock, Target, Flame } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell } from
'recharts';
export function Productivity() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/planner/productivity')
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error('Error fetching productivity stats:', err));
  }, []);

  if (!stats) {
    return <div className="p-8 text-center text-gray-500">Loading insights...</div>;
  }

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  const formattedFocus = stats.subjectFocus?.map((item, idx) => ({
    ...item,
    color: COLORS[idx % COLORS.length]
  })) || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Productivity Insights
        </h1>
        <p className="text-gray-600">
          Track your study habits and academic performance.
        </p>
      </div>

      <PlannerNav />

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <Target className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.completionRate}%
          </p>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Completion Rate
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.studyHoursThisWeek}h
          </p>
          <p className="text-sm text-gray-500 font-medium mt-1">Study Hours</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.streakDays}
          </p>
          <p className="text-sm text-gray-500 font-medium mt-1">Day Streak</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.score}
          </p>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Productivity Score
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Study Hours Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyTrend}>
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
                  }} />
                
                <Tooltip
                  cursor={{
                    fill: '#f3f4f6'
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <Bar dataKey="hours" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject Focus Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Subject Focus Distribution
          </h3>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedFocus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value">
                  
                  {formattedFocus.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-3">
              {formattedFocus.map((subject, idx) =>
              <div key={idx} className="flex items-center gap-2">
                  <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: subject.color
                  }}>
                </div>
                  <span className="text-sm text-gray-600 flex-1">
                    {subject.name}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {subject.value}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>);

}