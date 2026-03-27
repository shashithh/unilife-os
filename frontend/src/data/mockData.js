export const subjects = [
{
  id: 's1',
  name: 'Computer Science',
  code: 'CS101',
  color: 'bg-blue-500',
  text: 'text-blue-500',
  bgLight: 'bg-blue-100'
},
{
  id: 's2',
  name: 'Mathematics',
  code: 'MATH201',
  color: 'bg-purple-500',
  text: 'text-purple-500',
  bgLight: 'bg-purple-100'
},
{
  id: 's3',
  name: 'Physics',
  code: 'PHY101',
  color: 'bg-teal-500',
  text: 'text-teal-500',
  bgLight: 'bg-teal-100'
},
{
  id: 's4',
  name: 'English Literature',
  code: 'ENG101',
  color: 'bg-orange-500',
  text: 'text-orange-500',
  bgLight: 'bg-orange-100'
}];


export const tasks = [
{
  id: 't1',
  title: 'Complete Data Structures Assignment',
  subjectId: 's1',
  deadline: new Date(
    new Date().setDate(new Date().getDate() + 2)
  ).toISOString(),
  priority: 'High',
  risk: 'Critical',
  estimatedHours: 4,
  status: 'Pending'
},
{
  id: 't2',
  title: 'Study for Calculus Midterm',
  subjectId: 's2',
  deadline: new Date(
    new Date().setDate(new Date().getDate() + 5)
  ).toISOString(),
  priority: 'High',
  risk: 'Warning',
  estimatedHours: 8,
  status: 'In Progress'
},
{
  id: 't3',
  title: 'Physics Lab Report',
  subjectId: 's3',
  deadline: new Date(
    new Date().setDate(new Date().getDate() + 1)
  ).toISOString(),
  priority: 'Medium',
  risk: 'Critical',
  estimatedHours: 3,
  status: 'Pending'
},
{
  id: 't4',
  title: 'Essay Draft',
  subjectId: 's4',
  deadline: new Date(
    new Date().setDate(new Date().getDate() + 7)
  ).toISOString(),
  priority: 'Low',
  risk: 'Safe',
  estimatedHours: 2,
  status: 'Pending'
},
{
  id: 't5',
  title: 'Read Chapter 4 & 5',
  subjectId: 's1',
  deadline: new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toISOString(),
  priority: 'Medium',
  risk: 'Critical',
  estimatedHours: 2,
  status: 'Overdue'
},
{
  id: 't6',
  title: 'Math Homework Week 3',
  subjectId: 's2',
  deadline: new Date(
    new Date().setDate(new Date().getDate() - 2)
  ).toISOString(),
  priority: 'Low',
  risk: 'Safe',
  estimatedHours: 1.5,
  status: 'Completed'
}];


export const productivityStats = {
  score: 85,
  completionRate: 75,
  studyHoursThisWeek: 28,
  streakDays: 5,
  mostProductiveDay: 'Tuesday',
  weeklyTrend: [
  { name: 'Mon', hours: 4, completed: 2 },
  { name: 'Tue', hours: 6, completed: 4 },
  { name: 'Wed', hours: 5, completed: 3 },
  { name: 'Thu', hours: 3, completed: 1 },
  { name: 'Fri', hours: 7, completed: 5 },
  { name: 'Sat', hours: 2, completed: 0 },
  { name: 'Sun', hours: 1, completed: 0 }],

  subjectFocus: [
  { name: 'Computer Science', value: 40, color: '#3B82F6' },
  { name: 'Mathematics', value: 30, color: '#8B5CF6' },
  { name: 'Physics', value: 20, color: '#14B8A6' },
  { name: 'English', value: 10, color: '#F97316' }]

};

export const aiRecommendations = [
{
  id: 'r1',
  type: 'reschedule',
  title: 'Overloaded Thursday Detected',
  description:
  'You have 3 high-priority tasks due Friday. AI suggests moving the Physics Lab Report to Wednesday evening.',
  action: 'Auto-Reschedule'
},
{
  id: 'r2',
  type: 'focus',
  title: 'Calculus Midterm Approaching',
  description:
  'Based on your past completion rate, allocate 2 extra hours to Math this weekend to ensure a safe readiness level.',
  action: 'Add Study Block'
},
{
  id: 'r3',
  type: 'risk',
  title: 'Critical Risk: Data Structures',
  description:
  'This assignment usually takes 4 hours. You only have 2 hours of free time scheduled before the deadline.',
  action: 'Analyze Workload'
}];