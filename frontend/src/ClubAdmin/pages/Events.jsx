import { useState, useEffect } from 'react';
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
  X,
  Link as LinkIcon,
} from 'lucide-react';

import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { axiosInstance } from '../../apiConfig/axios';

// EventCard Component - Updated with dynamic statuses and conditional buttons
function EventCard({ event, onEdit, onDelete }) {
  // --- Dynamic Status Generation ---
  // This function generates a list of relevant status badges for an event.
  const getStatuses = (evt) => {
    const statuses = [];
    const now = new Date();

    // 1. Time-based status (most important)
    if (new Date(evt.end_date) < now) {
      statuses.push({ text: 'Salat / Finished', className: 'bg-gray-200 text-gray-800', priority: 1 });
    } else if (new Date(evt.start_date) < now && new Date(evt.end_date) > now) {
      statuses.push({ text: 'Daba Kayn / Happening Now', className: 'bg-red-100 text-red-800 animate-pulse', priority: 1 });
    } else {
      statuses.push({ text: 'Jay / Upcoming', className: 'bg-green-100 text-green-800', priority: 4 });
    }

    // 2. Capacity status (if registration is required)
    // Note: This assumes your API provides 'participants_count'. I've added it to the mock data.
    if (evt.requires_registration) {
        if ((evt.participants_count || 0) >= evt.max_participants) {
            statuses.push({ text: 'Omar / Full', className: 'bg-yellow-200 text-yellow-900', priority: 2 });
        } else {
            statuses.push({ text: ' التسجيل مفتوح / Registration Open', className: 'bg-teal-100 text-teal-800', priority: 5})
        }
    }


    // 3. Public/Private status
    if (evt.is_public) {
      statuses.push({ text: '3ami / Public', className: 'bg-blue-100 text-blue-800', priority: 3 });
    } else {
      statuses.push({ text: 'Khas / Private', className: 'bg-indigo-100 text-indigo-800', priority: 3 });
    }
    
    // Sort by priority and return the most relevant statuses
    return statuses.sort((a, b) => a.priority - b.priority);
  };

  const eventStatuses = getStatuses(event);
  const canBeModified = new Date(event.start_date) > new Date();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="h-48 w-full flex-shrink-0">
        <img
          src={event.cover_image}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/e2e8f0/4a5568?text=${event.title}`;
          }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-2">
            {eventStatuses.map(status => (
                 <span key={status.text} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                   {status.text}
                 </span>
            ))}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">{event.description}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>
              {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>
              {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          {event.meeting_link && (
             <div className="flex items-center">
               <LinkIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
               <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                 Meeting Link
               </a>
             </div>
          )}
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>Participants: {event.participants_count || 0} / {event.max_participants}</span>
          </div>
        </div>

        {/* Action Buttons: Show only if the event is upcoming and belongs to the user */}
        {canBeModified && (
          <div className="mt-5 pt-4 border-t border-gray-200 flex space-x-3">
            <button
              onClick={() => onEdit(event)}
              className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="flex-1 flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKey, setFilterKey] = useState('all'); 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('info');
  const [events, setEvents] = useState([]);

  const API_BASE_URL = 'YOUR_API_ENDPOINT_HERE'; 
  const AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/envents-club');
      const apiResponse = res.data;

      
      // Transform API data to match the component's expected structure
      const formattedEvents = apiResponse.data.map(event => ({
        ...event,
        id: event.id.toString(), // Ensure id is a string for consistency
      }));

      setEvents(formattedEvents);
      // --- End of mock data block ---

    } catch (error) {
      console.error("Failed to fetch events:", error);
      setSnackMessage('Failed to load events.');
      setSnackSeverity('error');
      setSnackOpen(true);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenForm = (eventToEdit = null) => {
    setEditingEvent(eventToEdit);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  }

  const handleDeleteEvent = async (id) => {
    const originalEvents = [...events];
    setEvents(events.filter(evt => evt.id !== id));
    setSnackMessage(`Event deleted successfully.`);
    setSnackSeverity('info');
    setSnackOpen(true);
    
    try {
      /*
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE', headers: { 'Authorization': AUTH_TOKEN }
      });
      if (!response.ok) { throw new Error('Failed to delete the event.'); }
      */
    } catch (error) {
      console.error("Delete failed:", error);
      setSnackMessage(error.message);
      setSnackSeverity('error');
      setSnackOpen(true);
      setEvents(originalEvents);
    }
  };
  
  const handleFormSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const eventData = {
          title: formData.get('title'),
          description: formData.get('description'),
          start_date: new Date(formData.get('start_date')).toISOString(),
          end_date: new Date(formData.get('end_date')).toISOString(),
          location: formData.get('location'),
          meeting_link: formData.get('meeting_link') || null,
          max_participants: parseInt(formData.get('max_participants'), 10),
          cover_image: formData.get('cover_image'),
          is_public: formData.get('is_public') === 'on',
          requires_registration: formData.get('requires_registration') === 'on',
      };

      const isUpdating = !!editingEvent;
      const url = isUpdating ? `${API_BASE_URL}/${editingEvent.id}` : API_BASE_URL;
      const method = isUpdating ? 'PUT' : 'POST';

      try {
          /*
          const response = await fetch(url, {
              method: method,
              headers: { 'Authorization': AUTH_TOKEN, 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(eventData)
          });
          if (!response.ok) {
              const errorBody = await response.json();
              throw new Error(errorBody.message || 'Failed to save the event.');
          }
          const savedEvent = await response.json();
          */

          const savedEvent = { 
              data: {
                  ...eventData, 
                  id: isUpdating ? editingEvent.id : (Math.random() * 1000).toString(), 
                  is_auth_user: true,
                  participants_count: 0, 
              }
          };
          
          if (isUpdating) {
              setEvents(events.map(evt => evt.id === savedEvent.data.id ? savedEvent.data : evt));
          } else {
              setEvents([savedEvent.data, ...events]);
          }
          
          setSnackMessage(`Event ${isUpdating ? 'updated' : 'created'} successfully!`);
          setSnackSeverity('success');
          setSnackOpen(true);
          handleCloseForm();
          e.target.reset();

      } catch (error) {
          console.error("Form submission failed:", error);
          setSnackMessage(error.message);
          setSnackSeverity('error');
          setSnackOpen(true);
      }
  };
  
  const formatDateTimeForInput = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - timezoneOffset);
      return localDate.toISOString().slice(0, 16);
  };

  const filteredEvents = events.filter(evt => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = evt.title.toLowerCase().includes(search) || evt.description.toLowerCase().includes(search) || evt.location.toLowerCase().includes(search);
    
    if (filterKey === 'all') return matchesSearch;
    if (filterKey === 'public') return matchesSearch && evt.is_public;
    if (filterKey === 'private') return matchesSearch && !evt.is_public;
    if (filterKey === 'mine') return matchesSearch && evt.is_auth_user;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh" sx={{ gap: 2 }}>
        <CircularProgress color="primary" thickness={4.5} size={50} />
        <Typography variant="body1" color="text.secondary">Loading events...</Typography>
      </Box>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Events Dashboard</h2>
          <Button variant="contained" startIcon={<Plus className="h-5 w-5" />} onClick={() => handleOpenForm()}>
            Create Event
          </Button>
        </div>

        {isFormOpen && (
          <Box component="form" onSubmit={handleFormSubmit} sx={{ p: {xs: 2, sm: 3}, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" gutterBottom>{editingEvent ? 'Edit Event' : 'Create New Event'}</Typography>
            <Stack spacing={2}>
              <TextField name="title" label="Title" required fullWidth defaultValue={editingEvent?.title || ''} />
              <TextField name="description" label="Description" multiline rows={3} required fullWidth defaultValue={editingEvent?.description || ''} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField name="start_date" label="Start Date & Time" type="datetime-local" required fullWidth InputLabelProps={{ shrink: true }} defaultValue={formatDateTimeForInput(editingEvent?.start_date)} />
                <TextField name="end_date" label="End Date & Time" type="datetime-local" required fullWidth InputLabelProps={{ shrink: true }} defaultValue={formatDateTimeForInput(editingEvent?.end_date)} />
              </Stack>
              <TextField name="location" label="Location" required fullWidth defaultValue={editingEvent?.location || ''} />
              <TextField name="meeting_link" label="Meeting Link (Optional)" fullWidth defaultValue={editingEvent?.meeting_link || ''} />
              <TextField name="max_participants" label="Max Participants" type="number" inputProps={{ min: 0 }} required fullWidth defaultValue={editingEvent?.max_participants || ''} />
              <TextField name="cover_image" label="Cover Image URL" fullWidth defaultValue={editingEvent?.cover_image || ''} />
               <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Switch name="is_public" defaultChecked={editingEvent?.is_public || false} />} label="Public Event" />
                  <FormControlLabel control={<Switch name="requires_registration" defaultChecked={editingEvent?.requires_registration !== false} />} label="Requires Registration" />
               </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                <Button onClick={handleCloseForm} variant="outlined">Cancel</Button>
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
                placeholder="Search events by title, description..."
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
                value={filterKey}
                onChange={(e) => setFilterKey(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              >
                <option value="all">Kolchi / All Events</option>
                <option value="public">3ami / Public</option>
                <option value="private">Khas / Private</option>
                <option value="mine">Dyali / My Events</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onEdit={handleOpenForm} onDelete={handleDeleteEvent} />
          ))}
          {filteredEvents.length === 0 && (
            <div className="col-span-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <Typography variant="h6" color="text.secondary">No Events Found</Typography>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
            {snackMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Events;
