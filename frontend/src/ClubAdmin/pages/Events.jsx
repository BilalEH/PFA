import { useState, useEffect } from 'react'
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

import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'

function EventCard({ event, onEdit, onDelete }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {event.cover_image && (
        <div className="h-48 w-full">
          <img src={event.cover_image} alt={event.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{event.description}</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      </div>
    </div>
  )
}

function Events() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreating, setIsCreating] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [events, setEvents] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents([
        {
          id: '1',
          title: 'Coding Workshop',
          description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
          start_date: '2025-05-15T13:00',
          end_date: '2025-05-15T16:00',
          location: 'Science Building, Room 305',
          max_participants: 30,
          cover_image: 'https://images.pexels.com/photos/7108/notebook-computer-chill-relax.jpg',
          status: 'approved'
        },
        {
          id: '2',
          title: 'Game Night',
          description: 'Join us for a fun night of board games and video games.',
          start_date: '2025-05-22T18:00',
          end_date: '2025-05-22T22:00',
          location: 'Student Union, Room 200',
          max_participants: 40,
          cover_image: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg',
          status: 'approved'
        },
        {
          id: '3',
          title: 'AI in Healthcare',
          description: 'Dr. Sarah Johnson discusses AI in healthcare.',
          start_date: '2025-06-03T14:00',
          end_date: '2025-06-03T16:00',
          location: 'Medical Sciences Building',
          max_participants: 100,
          cover_image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
          status: 'pending'
        }
      ])
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleEditEvent = (id) => {
    const eventToEdit = events.find(e => e.id === id)
    setEditingEvent(eventToEdit)
    setIsCreating(true)
  }

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(evt => evt.id !== id))
    setSnackMessage(`Event with ID ${id} deleted`)
    setSnackOpen(true)
  }

  const handleAddEvent = (e) => {
    e.preventDefault()
    const f = e.target
    const newEvent = {
      id: (events.length + 1).toString(),
      title: f.title.value,
      description: f.description.value,
      start_date: f.start_date.value,
      end_date: f.end_date.value,
      location: f.location.value,
      max_participants: parseInt(f.max_participants.value),
      cover_image: f.cover_image.value,
      status: 'pending'
    }
    setEvents([newEvent, ...events])
    setIsCreating(false)
    setSnackMessage('New event added successfully!')
    setSnackOpen(true)
    f.reset()
  }

  const handleUpdateEvent = (e) => {
    e.preventDefault()
    const f = e.target
    const updatedEvent = {
      ...editingEvent,
      title: f.title.value,
      description: f.description.value,
      start_date: f.start_date.value,
      end_date: f.end_date.value,
      location: f.location.value,
      max_participants: parseInt(f.max_participants.value),
      cover_image: f.cover_image.value,
    }
    setEvents(events.map(evt => evt.id === editingEvent.id ? updatedEvent : evt))
    setEditingEvent(null)
    setIsCreating(false)
    setSnackMessage('Event updated successfully!')
    setSnackOpen(true)
    f.reset()
  }

  const filteredEvents = events.filter(evt => {
    const search = searchTerm.toLowerCase()
    const matchesTitle = evt.title.toLowerCase().includes(search)
    const matchesDesc = evt.description.toLowerCase().includes(search)
    const matchesStatus = statusFilter === 'all' || evt.status === statusFilter
    return (matchesTitle || matchesDesc) && matchesStatus
  })

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh" sx={{ gap: 2 }}>
        <CircularProgress color="primary" thickness={4.5} size={50} />
        <Typography variant="body1" color="text.secondary">Chargement des événements...</Typography>
      </Box>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        <Button variant="contained" startIcon={<Plus className="h-5 w-5" />} onClick={() => { setIsCreating(true); setEditingEvent(null) }}>
          Create Event
        </Button>
      </div>

      {isCreating && (
        <Box component="form" onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff' }}>
          <Typography variant="h6" gutterBottom>{editingEvent ? 'Edit Event' : 'New Event'}</Typography>
          <Stack spacing={2}>
            <TextField name="title" label="Title" required fullWidth defaultValue={editingEvent?.title || ''} />
            <TextField name="description" label="Description" multiline rows={3} required fullWidth defaultValue={editingEvent?.description || ''} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField name="start_date" label="Start Date" type="datetime-local" required fullWidth InputLabelProps={{ shrink: true }} defaultValue={editingEvent?.start_date || ''} />
              <TextField name="end_date" label="End Date" type="datetime-local" required fullWidth InputLabelProps={{ shrink: true }} defaultValue={editingEvent?.end_date || ''} />
            </Stack>
            <TextField name="location" label="Location" required fullWidth defaultValue={editingEvent?.location || ''} />
            <TextField name="max_participants" label="Max Participants" type="number" required fullWidth defaultValue={editingEvent?.max_participants || ''} />
            <TextField name="cover_image" label="Cover Image URL" fullWidth defaultValue={editingEvent?.cover_image || ''} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => { setIsCreating(false); setEditingEvent(null) }} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained">{editingEvent ? 'Update Event' : 'Add Event'}</Button>
            </Box>
          </Stack>
        </Box>
      )}

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
              <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
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
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
        ))}
        {filteredEvents.length === 0 && (
          <div className="col-span-full bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No events found matching your search criteria.</p>
          </div>
        )}
      </div>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity="info" variant="filled" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Events
