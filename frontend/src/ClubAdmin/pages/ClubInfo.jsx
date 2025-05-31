import React, { useEffect, useState } from 'react';
import { Edit, MapPin } from 'lucide-react';
import { axiosInstance } from '../../apiConfig/axios';
import {
  Box, Typography, CircularProgress, Avatar, Button, Card, CardContent, Stack, Divider, Chip
} from '@mui/material';
import { motion } from 'framer-motion';

export default function ClubInfo({ clubId = 2 }) {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await axiosInstance.get(`/api/clubs/${clubId}`);
        setClub(response.data.data);
      } catch (error) {
        console.error('Failed to fetch club:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh" gap={2}>
        <CircularProgress color="primary" thickness={4.5} size={50} />
        <Typography variant="body1" color="text.secondary">
          Chargement des informations du club...
        </Typography>
      </Box>
    );
  }

  if (!club) return <Typography>Club not found.</Typography>;

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} p={3}>
      {/* Banner */}
      <Box
        sx={{
          height: 200,
          borderRadius: 3,
          backgroundColor: '#e0e0e0',
          backgroundImage: `url(${club.cover_image || 'https://via.placeholder.com/1200x300'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Edit />}
          sx={{ position: 'absolute', top: 16, right: 16, textTransform: 'none' }}
        >
          Edit Information
        </Button>
      </Box>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
        {/* Left section */}
        <Card component={motion.div} elevation={3} sx={{ flex: 2 }} whileHover={{ scale: 1.01 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Club Information</Typography>

            <Stack direction="row" spacing={3} alignItems="center" mb={3}>
              <Avatar
                src={club.logo || 'https://via.placeholder.com/96'}
                alt="Club Logo"
                sx={{ width: 72, height: 72, borderRadius: 2 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">{club.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                  <MapPin fontSize="small" />
                  <Typography>{club.location || 'No location provided'}</Typography>
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight="medium">About the Club</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{club.description || 'No description available.'}</Typography>

            <Typography variant="subtitle1" fontWeight="medium">Club Rules</Typography>
            <Typography color="text.secondary">
              {club.rules || <em style={{ color: '#9e9e9e' }}>No rules defined</em>}
            </Typography>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="medium">Upcoming Events</Typography>
            {club.events?.length > 0 ? (
              <ul>
                {club.events.map(event => (
                  <li key={event.id}>
                    <Typography>
                      <strong>{event.title}</strong> — {new Date(event.start_date).toLocaleString()}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography color="text.secondary"><em>No events planned</em></Typography>
            )}

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="medium">Interview Slots</Typography>
            {club.interview_slots?.length > 0 ? (
              <ul>
                {club.interview_slots.map(slot => (
                  <li key={slot.id}>
                    <Typography>
                      {new Date(slot.start_time).toLocaleString()} — {new Date(slot.end_time).toLocaleString()}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography color="text.secondary"><em>No interview slots available</em></Typography>
            )}
          </CardContent>
        </Card>

        {/* Right section */}
        <Card elevation={3} component={motion.div} sx={{ flex: 1 }} whileHover={{ scale: 1.01 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="medium" mb={2}>Club Details</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Club Name</Typography>
                <Typography variant="body1">{club.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Founded</Typography>
                <Typography variant="body1">
                  {club.foundation_date ? new Date(club.foundation_date).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={club.is_active ? 'Active' : 'Inactive'}
                  color={club.is_active ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
