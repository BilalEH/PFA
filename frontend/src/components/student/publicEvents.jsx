import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Container, Paper, Typography, Box, Avatar, Button, Chip, Grid, TextField,
  Stack, CircularProgress, Divider, Tooltip, IconButton, useTheme, Dialog,
  DialogTitle, DialogContent, DialogActions, useMediaQuery, Slide, Zoom,
  alpha, Rating, styled, AppBar, Tabs, Tab
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
// Assurez-vous que ces fonctions/instances sont correctement importées depuis votre configuration
import { axiosInstance } from "../../apiConfig/axios"; 
import { csrfRequest } from "../../apiConfig/csrfHelper";

// --- MUI Icons ---
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";
import StarRateIcon from "@mui/icons-material/StarRate";
import LinkIcon from "@mui/icons-material/Link";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import InfoIcon from '@mui/icons-material/Info';


// --- Styled Components & Helpers ---
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty': {
    color: alpha(theme.palette.action.active, 0.26),
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

// --- Main Component ---
function PublicEvents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // --- State ---
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [eventForDetails, setEventForDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Feedback State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [userHasFeedback, setUserHasFeedback] = useState(false);

  const eventsPerPage = 3;

  // --- Data Fetching & State Updates ---
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/public-events");
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Erreur de récupération des événements.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventForDetails) {
      // TODO: Remplacer par l'ID de l'utilisateur authentifié depuis votre contexte/état global
      const currentUserId = 4; // Exemple statique: ID de bilal el-haoudar
      const hasGiven = eventForDetails.feedback?.some(fb => fb.user?.id === currentUserId);
      setUserHasFeedback(!!hasGiven);
    }
  }, [eventForDetails]);

  // --- Handlers ---
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  /**
   * Gère la soumission du formulaire de feedback avec une gestion complète des erreurs.
   */
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Veuillez choisir une note (au moins 1 étoile).");
      return;
    }
    setIsSubmittingFeedback(true);

    try {
      const response = await csrfRequest('POST', `/api/events/${eventForDetails.id}/feedback`, { rating, comment });
      
      toast.success(response.data.message || "Votre avis a été ajouté avec succès !");

      // Mise à jour de l'état pour un affichage instantané
      const newFeedback = response.data.feedback;
      const updateEventWithNewFeedback = (event) => ({
          ...event,
          feedback: [newFeedback, ...(event.feedback || [])]
      });

      setEventForDetails(updateEventWithNewFeedback);
      setEvents(prevEvents => prevEvents.map(event => 
          event.id === eventForDetails.id ? updateEventWithNewFeedback(event) : event
      ));
      
      // Réinitialiser le formulaire
      setRating(0);
      setComment("");
      setUserHasFeedback(true); // Bloquer le formulaire après succès

    } catch (error) {
      if (error.response) {
        // Erreur gérée par le serveur (4xx, 5xx)
        const status = error.response.status;
        const message = error.response.data.message || "Une erreur inattendue est survenue.";

        if (status === 422) { // Erreur de validation Laravel
          const errors = error.response.data.errors;
          Object.values(errors).forEach(errArray => toast.error(errArray[0]));
        } else if (status === 401 || status === 400) {
          toast.error(message);
          setUserHasFeedback(true); // On assume que c'est une erreur de type "déjà voté" ou "non connecté"
        } else {
          toast.error(message);
        }
      } else {
        // Erreur réseau ou autre
        toast.error("Impossible de joindre le serveur. Vérifiez votre connexion.");
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };


  const handleOpenDetailsDialog = (event) => {
    setEventForDetails(event);
    setOpenDetailsDialog(true);
    setTabValue(0);
  };

  const handleCloseDetailsDialog = () => setOpenDetailsDialog(false);
  const handleJoin = (eventId) => toast.success(`Demande pour l'événement ${eventId} envoyée !`);
  const handlePageChange = (newPageIndex) => setCurrentPage(newPageIndex);
  const handlePrev = useCallback(() => setCurrentPage(p => p > 0 ? p - 1 : Math.ceil(events.length / eventsPerPage) - 1), [events.length, eventsPerPage]);
  const handleNext = useCallback(() => setCurrentPage(p => p < Math.ceil(events.length / eventsPerPage) - 1 ? p + 1 : 0), [events.length, eventsPerPage]);

  const displayedEvents = useMemo(() => {
    const slice = events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);
    while (slice.length > 0 && slice.length < eventsPerPage) slice.push(null);
    return slice;
  }, [events, currentPage, eventsPerPage]);

  // --- Render Functions ---
  const renderEventCard = (event, index) => {
    if (!event) return <Box sx={{ display: { xs: 'none', md: 'block' }, minHeight: 480 }} />;
    const averageRating = event.feedback?.length > 0 ? (event.feedback.reduce((a, b) => a + b.rating, 0) / event.feedback.length) : 0;
    
    return (
      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} transition={{ duration: 0.45, delay: index * 0.08 }} style={{ height: '100%' }}>
        <Paper sx={theme => ({ p: 3, borderRadius: 4, height: '100%', display: "flex", flexDirection: "column", border: `1px solid ${theme.palette.divider}`, background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`, transition: 'all 0.4s ease', transform: { md: index === 1 ? 'scale(1.02) translateY(-12px)' : 'scale(0.95)' }, zIndex: { md: index === 1 ? 10 : 1 }, boxShadow: { md: index === 1 ? 10 : 2 }, '&:hover': { transform: { md: 'scale(1.001) translateY(-5px)' }, boxShadow: { md: 7 } } })}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}><Avatar src={event.club?.logo} sx={{ width: 52, height: 52 }} /><Box sx={{ overflow: 'hidden' }}><Typography variant="h6" fontWeight={700} noWrap>{event.title}</Typography><Typography variant="body2" color="text.secondary">Par {event.club?.name}</Typography></Box></Stack>
          <Box sx={{ flexGrow: 1, mb: 2 }}>
            <Box sx={{ my: 2, borderRadius: 3, overflow: 'hidden', height: 180 }}><img src={event.cover_image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip icon={<EventIcon />} label={new Date(event.start_date).toLocaleDateString("fr-FR")} color="success" variant="outlined" size="small" /><Chip icon={<PlaceIcon />} label={event.location} color="info" variant="outlined" size="small" /><Chip icon={<PeopleAltIcon />} label={event.users_count || 0} color="primary" variant="outlined" size="small" />{averageRating > 0 && <Chip icon={<StarRateIcon />} label={averageRating.toFixed(1)} color="warning" variant="outlined" size="small" />}
            </Stack>
          </Box>
          <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}><Stack direction="row" spacing={2} sx={{ mt: 1 }}><Button fullWidth variant="outlined" onClick={() => handleOpenDetailsDialog(event)} startIcon={<ReadMoreIcon />}>Détails</Button><Button fullWidth variant="contained" onClick={() => handleJoin(event.id)} startIcon={<GroupIcon />}>Rejoindre</Button></Stack></Box>
        </Paper>
      </motion.div>
    );
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (events.length === 0) return <Typography align="center" sx={{ mt: 8 }}>Aucun événement public pour le moment.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: {xs: 4, sm: 8}, mb: 8 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><Typography variant="h3" component="h1" fontWeight={800} align="center" gutterBottom>Découvrez Nos Événements</Typography><Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: '650px', mx: 'auto' }}>Participez, partagez et grandissez avec notre communauté.</Typography></motion.div>
        <Box sx={{ position: 'relative' }}>
            <IconButton onClick={handlePrev} sx={{ position: "absolute", left: { xs: -16, sm: -32, md: -80 }, top: "50%", zIndex: 20, bgcolor: 'background.paper', boxShadow: 3 }}><ArrowBackIosNewIcon /></IconButton>
            <IconButton onClick={handleNext} sx={{ position: "absolute", right: { xs: -16, sm: -32, md: -80 }, top: "50%", zIndex: 20, bgcolor: 'background.paper', boxShadow: 3 }}><ArrowForwardIosIcon /></IconButton>
            <Grid container spacing={isMobile ? 2 : 3} justifyContent="center" alignItems="stretch"><AnimatePresence mode="wait">{displayedEvents.map((event, index) => (<Grid item xs={12} sm={6} md={4} key={event ? event.id : `empty-${index}`}>{renderEventCard(event, index)}</Grid>))}</AnimatePresence></Grid>
        </Box>
        {eventForDetails && (<Dialog fullScreen={isMobile} open={openDetailsDialog} onClose={handleCloseDetailsDialog} TransitionComponent={isMobile ? Transition : Zoom} PaperProps={{ sx: { borderRadius: isMobile ? 0 : 5, height: isMobile ? '100%' : 'auto', maxHeight: '90vh' } }} maxWidth="md" fullWidth>
            <DialogTitle sx={{ p: 2, m: 0 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700} noWrap>{eventForDetails.title}</Typography><IconButton edge="end" onClick={handleCloseDetailsDialog}><CloseIcon /></IconButton></Stack></DialogTitle>
            <AppBar position="sticky" color="default" elevation={1}><Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary"><Tab icon={<InfoIcon />} iconPosition="start" label="Détails" /><Tab icon={<PeopleAltIcon />} iconPosition="start" label={`Participants (${eventForDetails.users_count || 0})`} /><Tab icon={<RateReviewIcon />} iconPosition="start" label={`Avis (${eventForDetails.feedback?.length || 0})`} /></Tabs></AppBar>
            <DialogContent dividers sx={{ p: 0, m: 0 }}>
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ width: '100%', height: {xs: 200, sm: 300}, borderRadius: 3, overflow: 'hidden', mb: 3 }}><img src={eventForDetails.cover_image} alt={eventForDetails.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Box>
                  <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>{eventForDetails.title}</Typography><Typography paragraph color="text.secondary">{eventForDetails.description}</Typography><Divider sx={{ my: 2 }} /><Stack spacing={1.5}><Stack direction="row" alignItems="center" spacing={1.5}><CalendarMonthIcon color="action"/> <Typography><b>Début :</b> {new Date(eventForDetails.start_date).toLocaleString('fr-FR')}</Typography></Stack><Stack direction="row" alignItems="center" spacing={1.5}><CalendarMonthIcon color="action"/> <Typography><b>Fin :</b> {new Date(eventForDetails.end_date).toLocaleString('fr-FR')}</Typography></Stack><Stack direction="row" alignItems="center" spacing={1.5}><PlaceIcon color="action"/> <Typography><b>Lieu :</b> {eventForDetails.location}</Typography></Stack>{eventForDetails.meeting_link && <Stack direction="row" alignItems="center" spacing={1.5}><LinkIcon color="action"/> <Button href={eventForDetails.meeting_link} target="_blank">Lien de la réunion</Button></Stack>}</Stack><Divider sx={{ my: 2 }}><Chip label="Organisateur" size="small"/></Divider><Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}><Avatar src={eventForDetails.club.logo} sx={{ width: 56, height: 56 }}/><Box><Typography fontWeight="bold">{eventForDetails.club.name}</Typography><Typography variant="body2" color="text.secondary">{eventForDetails.club.description}</Typography></Box></Paper>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <Grid container spacing={2}>
                    {eventForDetails.users?.length > 0 ? eventForDetails.users.map(user => (<Grid item xs={12} sm={6} key={user.id}><Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 8 }}><Avatar src={user.profile_image} alt={`${user.first_name} ${user.last_name}`} sx={{ width: 48, height: 48 }}/><Typography fontWeight={600}>{user.first_name} {user.last_name}</Typography></Paper></Grid>)) : <Typography sx={{p: 3, width: '100%'}} align="center" color="text.secondary">Aucun participant.</Typography>}
                  </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <Stack spacing={3}>
                    <Box><Typography variant="h6" gutterBottom>Avis de la communauté</Typography>{eventForDetails.feedback?.length > 0 ? <Stack spacing={2}>{eventForDetails.feedback.map(fb => (<Paper key={fb.id} variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2 }}><Avatar src={fb.user?.profile_image} /><Box><Typography variant="subtitle2" fontWeight="bold">{fb.user?.first_name} {fb.user?.last_name}</Typography><StyledRating value={fb.rating} readOnly size="small" />{fb.comment && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>"{fb.comment}"</Typography>}</Box></Paper>))}</Stack> : <Typography align="center" color="text.secondary" sx={{ p: 3 }}>Soyez le premier à laisser un avis !</Typography>}</Box>
                    <Divider />
                    {userHasFeedback ? <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: alpha(theme.palette.success.main, 0.1) }}><Typography fontWeight={600} color="success.dark">Merci ! Vous avez déjà donné votre avis.</Typography></Paper> : (<Paper component="form" onSubmit={handleFeedbackSubmit} elevation={0} sx={{ p: {xs: 2, sm: 3}, borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }}><Stack spacing={2.5}><Typography variant="h6" align="center">Laissez votre avis</Typography><Box sx={{ display: 'flex', justifyContent: 'center' }}><StyledRating value={rating} onChange={(e, val) => setRating(val)} size="large" /></Box><TextField label="Commentaire (optionnel)" variant="outlined" value={comment} onChange={(e) => setComment(e.target.value)} fullWidth multiline minRows={3} /><Button type="submit" variant="contained" size="large" endIcon={isSubmittingFeedback ? <CircularProgress size={24} color="inherit" /> : <SendIcon />} disabled={isSubmittingFeedback}>{isSubmittingFeedback ? "Envoi..." : "Envoyer"}</Button></Stack></Paper>)}
                  </Stack>
                </TabPanel>
            </DialogContent>
            <DialogActions sx={{ p: {xs: 2, sm: 2} }}><Button onClick={handleCloseDetailsDialog}>Fermer</Button><Button onClick={() => handleJoin(eventForDetails.id)} variant="contained" startIcon={<GroupIcon />}>Rejoindre l'événement</Button></DialogActions>
        </Dialog>)}
    </Container>
  );
}

export default PublicEvents;