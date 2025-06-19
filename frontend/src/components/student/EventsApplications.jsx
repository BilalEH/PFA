import { useEffect, useState } from "react";
import { 
    Container, 
    Typography, 
    CircularProgress, 
    Box, 
    Stack, 
    Card, 
    CardContent, 
    CardMedia, 
    Button, 
    Modal,
    Paper,
    IconButton,
    Fade,
    Chip,
    useTheme // Import useTheme to access the current theme
} from "@mui/material";
import { motion } from "framer-motion";

// MUI Icons
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { axiosInstance } from "../../apiConfig/axios"; // STEP 1: Uncomment this line in your project.


// --- Event Details Modal Component (MUI Modern Version - FIXED) ---
const EventModal = ({ event, open, onClose }) => {
    if (!event) return null;
    
    const theme = useTheme(); // Access the current theme
    const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    const formatTime = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Define styles that adapt to the theme mode
    const modalStyle = {
        width: { xs: '95%', sm: '90%' },
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 4,
        boxShadow: 24,
        outline: 'none',
        // Glassmorphism effect that adapts to the theme
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
    };

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fade in={open}>
                <Paper sx={modalStyle}>
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia component="img" height="240" image={event.cover_image} alt={event.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/e0e0e0/ffffff?text=Image'; }}/>
                        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0, 0, 0, 0.5)', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)'}, color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box p={{ xs: 2, sm: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                             <CardMedia component="img" image={event.club.logo} alt={event.club.name} sx={{ width: 50, height: 50, borderRadius: '50%'}} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e0e0e0/ffffff?text=Logo'; }}/>
                            <Box>
                                <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary">{event.title}</Typography>
                                <Typography variant="subtitle1" color="primary.main" fontWeight="600">{event.club.name}</Typography>
                            </Box>
                        </Stack>
                        <Typography variant="body1" color="text.secondary" paragraph>{event.description}</Typography>
                        <Stack spacing={2} mt={3} borderTop={1} borderColor="divider" pt={3}>
                            <Stack direction="row" alignItems="center" spacing={1}><EventIcon color="action" /> <Typography variant="body2">{formatDate(event.start_date)}</Typography></Stack>
                            <Stack direction="row" alignItems="center" spacing={1}><AccessTimeIcon color="action" /> <Typography variant="body2">{`${formatTime(event.start_date)} - ${formatTime(event.end_date)}`}</Typography></Stack>
                            <Stack direction="row" alignItems="center" spacing={1}><LocationOnIcon color="action" /> <Typography variant="body2">{event.location || 'Non spécifié'}</Typography></Stack>
                            {event.meeting_link && <Stack direction="row" alignItems="center" spacing={1}><LinkIcon color="action" /> <Button size="small" href={event.meeting_link} target="_blank">Lien de la réunion</Button></Stack>}
                        </Stack>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    );
};

export default function EventsApplications() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("api/userevents");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching event applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  const handleOpenModal = (event) => setSelectedEvent(event);
  const handleCloseModal = () => setSelectedEvent(null);

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
  
  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { scale: 0.95, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } } };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
            Mes Inscriptions
        </Typography>

        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        ) : (
            <>
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Stack spacing={3}>
                        {events.length > 0 ? (
                        events.map((app) => (
                            <motion.div key={app.id} variants={itemVariants}>
                            <Card sx={{ 
                                display: 'flex',
                                borderRadius: 4,
                                transition: '0.3s ease-in-out',
                                position: 'relative',
                                overflow: 'hidden',
                                bgcolor: 'background.paper',
                                '&:hover': { transform: 'scale(1.02)', boxShadow: 10 }
                            }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: { xs: 120, sm: 180 }, flexShrink: 0 }}
                                    image={app.cover_image}
                                    alt={app.title}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e0e0e0/ffffff?text=Image'; }}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: {xs: 1.5, sm: 2.5} }}>
                                    <CardContent sx={{ flex: '1 0 auto', p: '0 !important' }}>
                                        <Chip label={app.club.name} color="primary" variant="outlined" size="small" sx={{mb: 1, fontWeight: 'bold'}}/>
                                        <Typography component="div" variant="h6" fontWeight="bold">{app.title}</Typography>
                                        <Stack spacing={0.5} mt={1}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <EventIcon sx={{fontSize: '1rem'}} color="action"/>
                                                <Typography variant="body2" color="text.secondary">{formatDate(app.start_date)}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <AccessTimeIcon sx={{fontSize: '1rem'}} color="action"/>
                                                <Typography variant="body2" color="text.secondary">{`${formatTime(app.start_date)} - ${formatTime(app.end_date)}`}</Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            onClick={() => handleOpenModal(app)}
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{ borderRadius: '999px', textTransform: 'none', fontWeight: 'bold' }}
                                        >
                                            Voir Détails
                                        </Button>
                                    </Box>
                                </Box>
                            </Card>
                            </motion.div>
                        ))
                        ) : (
                        <Paper sx={{ textAlign: 'center', p: 5, borderRadius: 4, bgcolor: 'transparent' }}>
                            <Typography variant="h6">Aucune inscription trouvée.</Typography>
                            <Typography color="text.secondary">Il semble que vous ne soyez inscrit à aucun événement pour le moment.</Typography>
                        </Paper>
                        )}
                    </Stack>
                </motion.div>
                <EventModal event={selectedEvent} open={Boolean(selectedEvent)} onClose={handleCloseModal} />
            </>
        )}
    </Container>
  );
}
