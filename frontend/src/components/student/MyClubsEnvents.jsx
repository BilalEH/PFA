import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, Avatar,
  Chip, Divider, Pagination, useTheme, CssBaseline, Skeleton, Stack,
  Button, Dialog, DialogTitle, DialogContent, IconButton, ToggleButtonGroup,
  ToggleButton, Rating, TextField, AppBar, Tabs, Tab, useMediaQuery, Slide, Zoom, alpha, styled, Paper,
  CircularProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, Award, Info, MessageSquare, Link as LinkIconLucide, X, UserPlus } from "lucide-react";
import { axiosInstance } from "../../apiConfig/axios";
import toast from "react-hot-toast";
import { csrfRequest } from '../../apiConfig/csrfHelper';

const MotionCard = motion(Card);
const ITEMS_PER_PAGE = 9;

// --- Styled Components & Helpers ---
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  '&.Mui-selected, &.Mui-selected:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty': { color: alpha(theme.palette.action.active, 0.26) },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '40vh' }}>{children}</Box>
        </motion.div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function MyClubsEnvents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- State ---
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogTab, setDialogTab] = useState(0);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasFeedback, setUserHasFeedback] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchClubsEvents = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/getMyClubsEvents");
        setClubs(res.data?.clubs || []); 
      } catch (err) {
        toast.error("Erreur de récupération de vos événements.");
      } finally {
        setLoading(false);
      }
    };
    fetchClubsEvents();
  }, []);

  // --- Data Processing ---
  const allEvents = useMemo(() => 
    clubs.flatMap(membership =>
      (membership.club.events || []).map(event => ({
        ...event,
        clubName: membership.club.name,
        clubLogo: membership.club.logo,
        clubDescription: membership.club.description,
        userRole: membership.role,
        feedback: event.feedback || [], 
        users: event.users || [],
      }))
    ), [clubs]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    switch (selectedFilter) {
      case "upcoming": return allEvents.filter((e) => new Date(e.start_date) > now);
      case "today": return allEvents.filter((e) => new Date(e.start_date).toDateString() === now.toDateString());
      case "registration": return allEvents.filter((e) => e.requires_registration);
      default: return allEvents;
    }
  }, [selectedFilter, allEvents]);
  
  const paginatedEvents = filteredEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // --- Handlers ---
  const handlePageChange = (event, value) => setPage(value);
  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) { setSelectedFilter(newFilter); setPage(1); }
  };

  const handleOpenDetails = (event) => {
    console.log("Selected Event:", event);
    setSelectedEvent(event);
    setDetailsOpen(true);
    setDialogTab(0);
    setRating(0);
    setComment("");
    const currentUserId = 4; // TODO: Remplacer par l'ID de l'utilisateur authentifié
    setUserHasFeedback(event.feedback.some(fb => fb.user_id === currentUserId));
  };
  
  const handleJoinEvent = async (eventId) => {
    const toastId = toast.loading('Demande en cours...');
    try {
      await csrfRequest('patch', `/api/events/${eventId}/join`);
      toast.success("Vous avez rejoint l'événement !", { id: toastId });
      // Optionnel: Mettre à jour l'état local pour refléter la participation
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Vous êtes déjà inscrit.", { id: toastId });
      } else {
        toast.error("Échec de la demande.", { id: toastId });
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Veuillez choisir une note.");
    setIsSubmitting(true);
    try {
      const response = await csrfRequest('POST', `/api/events/${selectedEvent.id}/feedbacks`, { rating, comment });
      toast.success("Avis ajouté avec succès !");
      const newFeedback = response.data.feedback;
      const updatedEvent = { ...selectedEvent, feedback: [newFeedback, ...selectedEvent.feedback] };
      setSelectedEvent(updatedEvent);
      setClubs(prevClubs => prevClubs.map(membership => ({
          ...membership,
          club: { ...membership.club, events: (membership.club.events || []).map(ev => ev.id === selectedEvent.id ? updatedEvent : ev) }
      })));
      setUserHasFeedback(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Functions ---
  const renderSkeletons = () => (
    Array.from({ length: 6 }).map((_, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}><Skeleton variant="rectangular" sx={{ borderRadius: 4, height: 450 }} /></Grid>
    ))
  );

  const renderEventCard = (event, index) => {
    const isEventOver = new Date() > new Date(event.end_date);
    
    return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', boxShadow: theme.shadows[2], '&:hover': { boxShadow: theme.shadows[6], transform: 'translateY(-4px)' }, transition: 'all 0.3s ease-in-out' }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" image={event.cover_image} alt={event.title} sx={{ height: 180 }} />
        <Avatar src={event.clubLogo} sx={{ width: 60, height: 60, position: "absolute", bottom: -30, left: 24, border: `4px solid ${theme.palette.background.paper}` }}/>
      </Box>
      <CardContent sx={{ pt: '40px', flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={700}>{event.title}</Typography>
          <Chip label={event.userRole} size="small" icon={<Award size={14} />} color="secondary" sx={{ fontWeight: "bold" }}/>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, minHeight: '42px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</Typography>
        <Stack spacing={1} mb={2}>
          <Stack direction="row" alignItems="center" spacing={1} color="text.secondary"><Calendar size={16} /><Typography variant="body2">{new Date(event.start_date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</Typography></Stack>
          <Stack direction="row" alignItems="center" spacing={1} color="text.secondary"><MapPin size={16} /><Typography variant="body2">{event.location}</Typography></Stack>
        </Stack>
        {/* --- ZONE D'ACTION AVEC LES DEUX BOUTONS --- */}
        <Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button fullWidth variant="outlined" onClick={() => handleOpenDetails(event)}>
                Détails
            </Button>
            <Button 
                fullWidth 
                variant="contained" 
                startIcon={<UserPlus size={16}/>}
                onClick={() => handleJoinEvent(event.id)}
                disabled={isEventOver}
            >
                {isEventOver ? 'Terminé' : 'Rejoindre'}
            </Button>
        </Stack>
      </CardContent>
    </MotionCard>
  )};

  return (
    <Box sx={{ py: 5, bgcolor: 'background.paper' }}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" align="center" sx={{ fontWeight: "bold", color: 'primary.main', mb: 2 }}>Mes Événements de Clubs</Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>Retrouvez ici tous les événements organisés par les clubs que vous avez rejoints.</Typography>
        <Stack direction="row" justifyContent="center" mb={5} flexWrap="wrap" gap={1}>
          <ToggleButtonGroup value={selectedFilter} exclusive onChange={handleFilterChange} color="primary">
            <StyledToggleButton value="all">Tous</StyledToggleButton>
            <StyledToggleButton value="upcoming">À venir</StyledToggleButton>
            <StyledToggleButton value="today">Aujourd'hui</StyledToggleButton>
            <StyledToggleButton value="registration">Inscription Requise</StyledToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Grid container spacing={4} alignItems="stretch">
          {loading ? renderSkeletons() : paginatedEvents.length > 0 ? paginatedEvents.map((event, index) => (
            <Grid item xs={12} sm={6} lg={4} key={`${event.id}-${index}`} sx={{ display: 'flex' }}>
              {renderEventCard(event, index)}
            </Grid>
          )) : (
            <Grid item xs={12}><Typography align="center" color="text.secondary" sx={{p: 5}}>Aucun événement ne correspond à vos filtres.</Typography></Grid>
          )}
        </Grid>

        {!loading && filteredEvents.length > ITEMS_PER_PAGE && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" /></Box>
        )}
      </Container>
      
      {/* Le Dialog reste inchangé */}
      {selectedEvent && (
        <Dialog fullScreen={isMobile} open={detailsOpen} onClose={() => setDetailsOpen(false)} TransitionComponent={Transition} maxWidth="md" fullWidth PaperProps={{sx: {borderRadius: isMobile ? 0 : 4}}}>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700}>{selectedEvent.title}</Typography><IconButton onClick={() => setDetailsOpen(false)}><X /></IconButton></Stack>
          </DialogTitle>
          <AppBar position="static" color="default" elevation={0}><Tabs value={dialogTab} onChange={(e,v) => setDialogTab(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
              <Tab icon={<Info size={18} />} label="Détails" />
              <Tab icon={<Users size={18} />} label={`Participants (${selectedEvent.users.length})`} />
              <Tab icon={<MessageSquare size={18} />} label={`Avis (${selectedEvent.feedback.length})`} />
          </Tabs></AppBar>
          <DialogContent dividers sx={{ p: 0 }}>
            <AnimatePresence mode="wait">
              {dialogTab === 0 && <TabPanel value={dialogTab} index={0}>
                <Box sx={{ width: '100%', height: {xs: 200, sm: 300}, borderRadius: 3, overflow: 'hidden', mb: 3 }}><img src={selectedEvent.cover_image} alt={selectedEvent.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>{selectedEvent.title}</Typography><Typography paragraph color="text.secondary">{selectedEvent.description}</Typography><Divider sx={{ my: 2 }} /><Stack spacing={1.5}><Stack direction="row" alignItems="center" spacing={1.5}><Calendar color={theme.palette.text.secondary} size={20} /><Typography><b>Début :</b> {new Date(selectedEvent.start_date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</Typography></Stack><Stack direction="row" alignItems="center" spacing={1.5}><Calendar color={theme.palette.text.secondary} size={20} /><Typography><b>Fin :</b> {new Date(selectedEvent.end_date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</Typography></Stack><Stack direction="row" alignItems="center" spacing={1.5}><MapPin color={theme.palette.text.secondary} size={20} /><Typography><b>Lieu :</b> {selectedEvent.location}</Typography></Stack><Stack direction="row" alignItems="center" spacing={1.5}><Users color={theme.palette.text.secondary} size={20} /><Typography><b>Participants Max :</b> {selectedEvent.max_participants || 'Non spécifié'}</Typography></Stack>{selectedEvent.meeting_link && <Stack direction="row" alignItems="center" spacing={1.5}><LinkIconLucide color={theme.palette.text.secondary} size={20} /><Button href={selectedEvent.meeting_link} target="_blank">Lien de la réunion</Button></Stack>}</Stack><Divider sx={{ my: 3 }}><Chip label="Organisé par" /></Divider><Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}><Avatar src={selectedEvent.clubLogo} sx={{ width: 56, height: 56 }}/><Box><Typography fontWeight="bold">{selectedEvent.clubName}</Typography><Typography variant="body2" color="text.secondary">{selectedEvent.clubDescription}</Typography></Box></Paper>
              </TabPanel>}
              {dialogTab === 1 && <TabPanel value={dialogTab} index={1}>
                <Grid container spacing={2}>{selectedEvent.users.length > 0 ? selectedEvent.users.map(user => (<Grid item xs={12} sm={6} key={user.id}><Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 8 }}><Avatar src={user.profile_image}/><Typography fontWeight={600}>{user.first_name} {user.last_name}</Typography></Paper></Grid>)) : <Typography sx={{p:3, width: '100%'}} align="center" color="text.secondary">Aucun participant inscrit.</Typography>}</Grid>
              </TabPanel>}
              {dialogTab === 2 && <TabPanel value={dialogTab} index={2}>
                  <Stack spacing={3}>
                    {selectedEvent.feedback.length > 0 ? (<Stack spacing={2}>{selectedEvent.feedback.map(fb => (<Paper key={fb.id} variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2 }}><Avatar src={fb.user?.profile_image} /><Box><Typography variant="subtitle2" fontWeight="bold">{fb.user?.first_name} {fb.user?.last_name}</Typography><StyledRating value={fb.rating} readOnly size="small" />{fb.comment && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>"{fb.comment}"</Typography>}</Box></Paper>))}</Stack>) : <Typography align="center" color="text.secondary" sx={{ py: 3 }}>Aucun avis pour le moment.</Typography>}
                    <Divider />
                    {userHasFeedback ? (<Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: alpha(theme.palette.success.main, 0.1) }}><Typography fontWeight={600} color="success.dark">Vous avez déjà donné votre avis.</Typography></Paper>) : (<Paper component="form" onSubmit={handleFeedbackSubmit} elevation={0} sx={{ p: {xs: 2, sm: 3}, borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }}><Stack spacing={2.5}><Typography variant="h6" align="center">Laisser votre avis</Typography><Box sx={{ display: 'flex', justifyContent: 'center' }}><StyledRating value={rating} onChange={(e, val) => setRating(val)} size="large" /></Box><TextField label="Commentaire (optionnel)" variant="outlined" value={comment} onChange={e => setComment(e.target.value)} fullWidth multiline minRows={3} /><Button type="submit" variant="contained" size="large" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24}/> : "Envoyer mon avis"}</Button></Stack></Paper>)}
                  </Stack>
              </TabPanel>}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
