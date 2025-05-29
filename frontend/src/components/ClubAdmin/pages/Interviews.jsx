import { useState } from 'react'
import {
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Filter,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// Un seul item d'entretien
function InterviewItem({ interview, onUpdateStatus }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    missed: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="mr-4 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {interview.student_name}
            </h3>
            <p className="text-sm text-gray-500">{interview.student_email}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[interview.status]
          }`}
        >
          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
        </span>
      </div>

      {interview.scheduled_at && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              {new Date(interview.scheduled_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              {new Date(interview.scheduled_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      )}

      {interview.meeting_link && (
        <div className="mb-4">
          <a
            href={interview.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Join Meeting
          </a>
        </div>
      )}

      {interview.feedback && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h4>
          <p className="text-sm text-gray-600">{interview.feedback}</p>
        </div>
      )}

      {interview.status === 'pending' && (
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => onUpdateStatus(interview.id, 'scheduled')}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Schedule Interview
          </button>
          <button
            onClick={() => onUpdateStatus(interview.id, 'canceled')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Decline
          </button>
        </div>
      )}

      {interview.status === 'scheduled' && (
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => onUpdateStatus(interview.id, 'completed')}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark as Completed
          </button>
          <button
            onClick={() => onUpdateStatus(interview.id, 'missed')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Mark as Missed
          </button>
        </div>
      )}
    </div>
  )
}

function Interviews() {
  const { club } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  // Données mockées – à remplacer par un appel API réel
  const [interviews, setInterviews] = useState([
    {
      id: '1',
      student_name: 'Maria Garcia',
      student_email: 'maria.garcia@example.com',
      status: 'pending',
      application_id: 'app1'
    },
    {
      id: '2',
      student_name: 'James Wilson',
      student_email: 'james.wilson@example.com',
      status: 'pending',
      application_id: 'app2'
    },
    {
      id: '3',
      student_name: 'Emma Chen',
      student_email: 'emma.chen@example.com',
      status: 'scheduled',
      scheduled_at: '2025-05-15T14:00:00',
      meeting_link: 'https://meet.google.com/abc-defg-hij',
      application_id: 'app3'
    },
    {
      id: '4',
      student_name: 'Alex Rodriguez',
      student_email: 'alex.rodriguez@example.com',
      status: 'completed',
      scheduled_at: '2025-05-01T10:30:00',
      feedback:
        'Great candidate with strong technical skills and team spirit.',
      application_id: 'app4'
    },
    {
      id: '5',
      student_name: 'Olivia Johnson',
      student_email: 'olivia.johnson@example.com',
      status: 'canceled',
      application_id: 'app5'
    },
    {
      id: '6',
      student_name: 'Ethan Patel',
      student_email: 'ethan.patel@example.com',
      status: 'missed',
      scheduled_at: '2025-05-03T15:30:00',
      application_id: 'app6'
    }
  ])

  const handleUpdateStatus = (id, status) => {
    setInterviews(
      interviews.map((iv) =>
        iv.id === id ? { ...iv, status } : iv
      )
    )
    alert(`Interview status updated to ${status} for ID ${id}`)
  }

  // Filtrage selon recherche et statut
  const filteredInterviews = interviews.filter((iv) => {
    const matchesName = iv.student_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || iv.status === filter
    return matchesName && matchesFilter
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Interview Requests
        </h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
            >
              <option value="all">All Interviews</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInterviews.map((interview) => (
          <InterviewItem
            key={interview.id}
            interview={interview}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}

        {filteredInterviews.length === 0 && (
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">
              No interviews found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Interviews
