import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../apiConfig/axios';
import LoadingScreen from '../ui/LoadingScreen';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Divider, 
  Chip,
  Avatar,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
  Container,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Event as EventIcon, 
  LocationOn as LocationIcon,
  Computer as OnlineIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isPast, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

// Styled Components
const StyledClubCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  height: '100%',
  maxHeight: '420px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  boxShadow: theme.shadows[2],
  transition: 'all 0.2s ease-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(3),
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    minHeight: '60vh',
  },
}));

const GlassContainer = styled(Paper)(({ theme }) => ({
  background: `rgba(${theme.palette.mode === 'dark' ? '255,255,255' : '0,0,0'}, 0.02)`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
}));

const TimeTableSlot = styled(Paper)(({ theme, available }) => ({
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  cursor: available ? 'pointer' : 'not-allowed',
  backgroundColor: available 
    ? theme.palette.success.light
    : theme.palette.error.light,
  color: available 
    ? theme.palette.success.contrastText 
    : theme.palette.error.contrastText,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: available ? 'translateY(-2px)' : 'none',
    boxShadow: available ? theme.shadows[2] : 'none',
    backgroundColor: available 
      ? theme.palette.success.main
      : theme.palette.error.light,
  },
  position: 'relative',
  overflow: 'hidden',
}));

const DayColumn = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  minWidth: 250,
  background: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  flexShrink: 0,
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      duration: 0.2,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
};

const ClubsToInterview = () => {
  const [loading, setLoading] = useState(true);
  const [clubsList, setClubsList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingInterview, setLoadingInterview] = useState(false);
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axiosInstance.get('/api/clubs');
        setClubsList(response.data);
      } catch (err) {
        console.error('Error fetching clubs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const processTimeSlots = (interviews) => {
    const slotsByDay = {};
    
    interviews.forEach(interview => {
      const start = parseISO(interview.start_time);
      const end = parseISO(interview.end_time);
      const dayKey = format(start, 'yyyy-MM-dd');
      
      if (!slotsByDay[dayKey]) {
        slotsByDay[dayKey] = {
          date: start,
          slots: []
        };
      }
      
      const isAvailable = interview.booked_interviews < interview.max_interviews && !isPast(end);

      slotsByDay[dayKey].slots.push({
        ...interview,
        start,
        end,
        isAvailable
      });
    });
    
    return Object.values(slotsByDay).sort((a, b) => a.date - b.date);
  };

  const getInterviewSlots = async (club) => {
    setLoadingInterview(true);
    setSelectedClub(club);
    
    try {
      const response = await axiosInstance.get(`/api/club/${club.id}`);
      const processed = processTimeSlots(response.data.interviews);
      setTimeSlots(processed);
      setDialogOpen(true);
    } catch (err) {
      console.error('Error fetching interview slots:', err);
    } finally {
      setLoadingInterview(false);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.isAvailable) {
      navigate(`/student/apply/${slot.id}`);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setSelectedClub(null);
      setTimeSlots([]);
    }, 200);
  };

  const renderInterviewSkeleton = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Card key={i} sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Skeleton variant="rectangular" height={20} width="60%" />
            <Skeleton variant="text" height={16} />
            <Skeleton variant="text" height={16} />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rectangular" height={24} width={80} />
              <Skeleton variant="rectangular" height={24} width={100} />
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );

  const renderTimeTable = () => {
    if (loadingInterview) return renderInterviewSkeleton();

    return (
      <Box sx={{ 
        display: 'flex',
        overflowX: 'auto',
        py: 2,
        minHeight: 400,
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.grey[100],
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.primary.main,
          borderRadius: 4,
        },
      }}>
        {timeSlots.length > 0 ? (
          timeSlots.map(day => (
            <DayColumn key={day.date.toString()} elevation={1}>
              <Typography variant="h6" gutterBottom>
                {format(day.date, 'EEEE d MMMM', { locale: fr })}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {day.slots.map(slot => (
                <TimeTableSlot 
                  key={slot.id}
                  available={slot.isAvailable}
                  onClick={() => handleSlotSelect(slot)}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2">
                      {format(slot.start, 'HH:mm')} - {format(slot.end, 'HH:mm')}
                    </Typography>
                    <Chip
                      label={slot.is_online ? 'En ligne' : slot.location || 'Sur place'}
                      size="small"
                      color={slot.isAvailable ? 'success' : 'error'}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption">
                      {slot.booked_interviews}/{slot.max_interviews} places
                    </Typography>
                    {slot.isAvailable && (
                      <Typography variant="caption" sx={{ 
                        mt: 1,
                        display: 'inline-block',
                        fontWeight: 'bold',
                        color: 'inherit'
                      }}>
                        Cliquez pour postuler
                      </Typography>
                    )}
                  </Stack>
                </TimeTableSlot>
              ))}
            </DayColumn>
          ))
        ) : (
          <Box sx={{ 
            py: 6, 
            textAlign: 'center',
            width: '100%'
          }}>
            <EventIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucun créneau disponible
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Ce club n'a pas encore programmé d'entretiens ou tous les créneaux sont complets.
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={cardVariants}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              fontWeight="bold" 
              sx={{
                color: theme.palette.primary.main,
                mb: 1,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  borderRadius: 2,
                }
              }}
            >
              Entretiens des Clubs
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sélectionnez un club pour voir les créneaux disponibles
            </Typography>
          </Box>
        </motion.div>

        {/* Clubs Grid */}
        <motion.div variants={cardVariants}>
          <GlassContainer elevation={0}>
            <Typography 
              variant="h5" 
              fontWeight="600" 
              gutterBottom 
              sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <GroupsIcon color="primary" />
              Clubs Disponibles
            </Typography>
            
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {clubsList.map((club, index) => (
                <Grid item xs={12} sm={6} lg={4} key={club.id}>
                  <motion.div
                    variants={cardVariants}
                    custom={index}
                    layout
                  >
                    <StyledClubCard
                      onClick={() => getInterviewSlots(club)}
                      elevation={0}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CardMedia
                        component="img"
                        height={isMobile ? "140" : "160"}
                        image={club.cover_image || '/default-club-cover.jpg'}
                        alt={club.name}
                        sx={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                          height: '150px',
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 2.5 } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                          <Avatar
                            src={club.logo || '/default-club-logo.png'}
                            alt={club.name}
                            sx={{ 
                              width: { xs: 40, md: 55 }, 
                              height: { xs: 40, md: 55 },
                              boxShadow: theme.shadows[2]
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="h6" 
                              noWrap 
                              fontWeight="600"
                              sx={{ 
                                fontSize: { xs: '0.95rem', md: '1.1rem' },
                                color: 'text.primary'
                              }}
                            >
                              {club.name}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                            fontSize: '0.85rem'
                          }}
                        >
                          {club.description}
                        </Typography>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip
                            label={club.is_active ? 'Actif' : 'Inactif'}
                            size="small"
                            color={club.is_active ? 'success' : 'error'}
                            variant="filled"
                            sx={{ 
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            color="primary.main"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.8rem'
                            }}
                          >
                            Voir créneaux →
                          </Typography>
                        </Stack>
                      </CardContent>
                    </StyledClubCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </GlassContainer>
        </motion.div>

        {/* Interview Dialog */}
        <StyledDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="lg"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ p: 3, pb: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={selectedClub?.logo} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography variant="h5">
                  {selectedClub?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sélectionnez un créneau disponible
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            {renderTimeTable()}

            <Box sx={{ 
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  bgcolor: 'success.main',
                  borderRadius: '2px',
                  mr: 1
                }} />
                <Typography variant="caption">Disponible</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  bgcolor: 'error.main',
                  borderRadius: '2px',
                  mr: 1
                }} />
                <Typography variant="caption">Complet/Passé</Typography>
              </Box>
            </Box>
          </DialogContent>
        </StyledDialog>
      </motion.div>
    </Container>
  );
};

export default ClubsToInterview;