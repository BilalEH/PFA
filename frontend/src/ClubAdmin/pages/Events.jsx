import { useState } from 'react'
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X
} from 'lucide-react'

// Carte d’un événement individuel
function EventCard({ event, onEdit, onDelete }) {
  // Dummy permission
  const canManage = true

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {event.cover_image && (
        <div className="h-48 w-full">
          <img
            src={event.cover_image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[event.status]
            }`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {event.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {new Date(event.start_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              {event.end_date &&
                event.start_date !== event.end_date && (
                  <>
                    {' - '}
                    {new Date(event.end_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </>
                )}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {new Date(event.start_date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
              {' - '}
              {new Date(event.end_date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>Max participants: {event.max_participants}</span>
          </div>
        </div>

        {canManage && (
          <div className="mt-5 flex space-x-3">
            <button
              onClick={() => onEdit(event.id)}
              className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Page principale des événements
function Events() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Coding Workshop',
      description:
        'Learn the basics of web development with HTML, CSS, and JavaScript.',
      start_date: '2025-05-15T13:00:00',
      end_date: '2025-05-15T16:00:00',
      location: 'Science Building, Room 305',
      max_participants: 30,
      cover_image:
        'https://images.pexels.com/photos/7108/notebook-computer-chill-relax.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      is_public: true,
      requires_registration: true,
      status: 'approved'
    },
    {
      id: '2',
      title: 'Game Night',
      description: 'Join us for a fun night of board games and video games.',
      start_date: '2025-05-22T18:00:00',
      end_date: '2025-05-22T22:00:00',
      location: 'Student Union, Room 200',
      max_participants: 40,
      cover_image:
        'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      is_public: true,
      requires_registration: false,
      status: 'approved'
    },
    {
      id: '3',
      title: 'AI in Healthcare',
      description: 'Dr. Sarah Johnson discusses AI in healthcare.',
      start_date: '2025-06-03T14:00:00',
      end_date: '2025-06-03T16:00:00',
      location: 'Medical Sciences Building',
      max_participants: 100,
      cover_image:
        'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      is_public: true,
      requires_registration: true,
      status: 'pending'
    }
  ])

  const handleEditEvent = (id) => {
    alert(`Edit event with ID ${id}`)
  }

  const handleDeleteEvent = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter((evt) => evt.id !== id))
      alert(`Event with ID ${id} deleted`)
    }
  }

  const filteredEvents = events.filter((evt) => {
    const titleMatch = evt.title.toLowerCase().includes(searchTerm.toLowerCase())
    const descriptionMatch = evt.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return (
      (titleMatch || descriptionMatch) &&
      (statusFilter === 'all' || evt.status === statusFilter)
    )
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">
              No events found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
