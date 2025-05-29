import { Calendar, Users, Bell, Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  )
}

function UpcomingEvent({ title, date, participants }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="flex items-center">
        <Users className="h-4 w-4 text-gray-400 mr-1" />
        <span className="text-sm text-gray-600">{participants}</span>
      </div>
    </div>
  )
}

function PendingInterview({ student, date, time }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{student}</h3>
        <p className="text-sm text-gray-500">
          {date} at {time}
        </p>
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
          Accept
        </button>
        <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
          Decline
        </button>
      </div>
    </div>
  )
}

function Dashboard() {
  const { club } = useAuth()

  // Mock data – remplacer par un fetch réel en production
  const stats = [
    { title: 'Total Members', value: 42, icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Interviews', value: 7, icon: Calendar, color: 'bg-orange-500' },
    { title: 'Upcoming Events', value: 3, icon: Bell, color: 'bg-purple-500' },
    { title: 'Active Projects', value: 12, icon: Activity, color: 'bg-green-500' },
  ]

  const upcomingEvents = [
    { title: 'Coding Workshop', date: 'May 15, 2025', participants: 18 },
    { title: 'Game Night', date: 'May 22, 2025', participants: 24 },
    { title: 'Industry Speaker', date: 'June 3, 2025', participants: 35 },
  ]

  const pendingInterviews = [
    { student: 'Maria Garcia', date: 'May 10, 2025', time: '2:00 PM' },
    { student: 'James Wilson', date: 'May 11, 2025', time: '3:30 PM' },
    { student: 'Emma Chen', date: 'May 12, 2025', time: '10:00 AM' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back to {club?.name}
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your club today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Upcoming Events</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingEvents.map((event) => (
              <UpcomingEvent
                key={event.title}
                title={event.title}
                date={event.date}
                participants={event.participants}
              />
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <a
              href="/events"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all events →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Pending Interviews</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingInterviews.map((interview) => (
              <PendingInterview
                key={interview.student}
                student={interview.student}
                date={interview.date}
                time={interview.time}
              />
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <a
              href="/interviews"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Manage all interviews →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
