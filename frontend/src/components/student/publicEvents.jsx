import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  Grid,
  TextField,
  Stack,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Slide,
  Zoom,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { axiosInstance } from "../../apiConfig/axios"; // Ensure this path is correct
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import StarRateIcon from "@mui/icons-material/StarRate";
import LinkIcon from "@mui/icons-material/Link";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import RuleIcon from "@mui/icons-material/Gavel";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Transition for the Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PublicEvents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [selectedEventIdForComment, setSelectedEventIdForComment] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 3;

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [eventForDetails, setEventForDetails] = useState(null);

  // --- NEW STATE FOR FEEDBACK PAGINATION ---
  const [currentFeedbackPage, setCurrentFeedbackPage] = useState(0);
  const feedbackPerPage = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Ensure loading is true at the start of fetch
      try {
        const res = await axiosInstance.get("/api/public-events");
        setEvents(Array.isArray(res.data) ? res.data : []); // Ensure events is an array
      } catch (err) {
        console.error("Fetch events error:", err);
        toast.error("Erreur lors de la récupération des événements publics.");
        setEvents([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = async (eventId) => {
    if (!comment.trim()) {
      toast.error("Le commentaire ne peut pas être vide.");
      return;
    }
    // TODO: Implement comment submit logic (API call)
    // For example:
    // try {
    //   await axiosInstance.post(`/api/events/${eventId}/comments`, { comment });
    //   toast.success("Commentaire envoyé !");
    //   setComment("");
    //   setSelectedEventIdForComment(null);
    //   // Optionally, re-fetch event details to show the new comment
    //   if (eventForDetails && eventForDetails.id === eventId) {
    //     const res = await axiosInstance.get(`/api/public-events/${eventId}`);
    //     setEventForDetails(res.data);
    //   }
    // } catch (error) {
    //   toast.error("Erreur lors de l'envoi du commentaire.");
    // }
    toast.success("Commentaire envoyé (simulation) !");
    setComment("");
    setSelectedEventIdForComment(null);
  };

  const handleJoin = (eventId) => {
    // TODO: Implement join event logic (API call)
    toast.success("Demande de participation envoyée !");
  };

  const handlePrev = () => {
    setCurrentPage((prev) =>
      prev === 0 ? Math.ceil(events.length / eventsPerPage) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev === Math.ceil(events.length / eventsPerPage) - 1 ? 0 : prev + 1
    );
  };

  const handleOpenDetailsDialog = (event) => {
    setEventForDetails(event);
    setCurrentFeedbackPage(0); // Reset feedback page when opening new dialog
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setTimeout(() => setEventForDetails(null), theme.transitions.duration.leavingScreen);
  };

  // --- HANDLERS FOR FEEDBACK PAGINATION ---
  const handleNextFeedback = () => {
    setCurrentFeedbackPage((prev) => prev + 1);
  };
  const handlePrevFeedback = () => {
    setCurrentFeedbackPage((prev) => Math.max(0, prev - 1));
  };


  const currentEvents = Array.isArray(events) ? events.slice(
    currentPage * eventsPerPage,
    currentPage * eventsPerPage + eventsPerPage
  ) : [];

  const displayedEvents = [...currentEvents];
  // Only pad if there are some events on the page but less than eventsPerPage
  if (displayedEvents.length > 0 && displayedEvents.length < eventsPerPage) {
    while (displayedEvents.length < eventsPerPage) {
      displayedEvents.push(null);
    }
  }


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  const eventCardStyle = {
    p: { xs: 2, sm: 3 },
    borderRadius: 3, // Slightly softer radius
    minHeight: { xs: 'auto', md: 480 }, // Responsive minHeight
    height: '100%', // For Grid alignItems="stretch"
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2], // Softer shadow initially
    background: theme.palette.background.paper,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)', // Subtle lift
      boxShadow: theme.shadows[6],
    }
  };

  const renderEventContent = (event, isDialog = false) => {
    if (!event) return null;

    const club = event.club || {};
    const users = event.users || [];
    const feedback = Array.isArray(event.feedback) ? event.feedback : [];

    // Feedback pagination logic for dialog
    const totalFeedbackPages = Math.ceil(feedback.length / feedbackPerPage);
    const displayedFeedbackItems = isDialog 
        ? feedback.slice(0, (currentFeedbackPage + 1) * feedbackPerPage) 
        : feedback.slice(0, feedbackPerPage); // Show first 3 on card if needed, or remove from card

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top section of the card/dialog */}
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar src={club.logo} alt={club.name} sx={{ width: 56, height: 56, bgcolor: "primary.main", border: `2px solid ${theme.palette.background.paper}` }} />
            <Box sx={{overflow: 'hidden'}}>
                <Typography variant={isDialog ? "h5" : "h6"} fontWeight={700} color="text.primary" noWrap title={event.title}>{event.title}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap title={`Organisé par : ${club.name}`}>Organisé par : {club.name}</Typography>
            </Box>
            {!isDialog && (
                <Chip icon={<GroupIcon />} label={`${event.users_count || 0}`} color="primary" sx={{ ml: "auto", fontWeight: 600, px: 1, display: {xs: 'none', sm: 'flex'} }} title={`${event.users_count || 0} participants`}/>
            )}
            </Stack>

            {isDialog && club.description && (
                <Box sx={{ mb: 2, p:1.5, background: alpha(theme.palette.primary.light, 0.15), borderRadius: 1.5, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`}}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <InfoIcon color="primary" fontSize="small" sx={{mt: 0.5}}/>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            <strong>À propos du club:</strong> {club.description}
                        </Typography>
                    </Stack>
                    {club.rules && (
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1 }}>
                        <RuleIcon color="warning" fontSize="small" sx={{mt: 0.5}}/>
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        <strong>Règles:</strong> {club.rules}
                        </Typography>
                    </Stack>
                    )}
                </Box>
            )}

            {event.cover_image && (
            <Box sx={{ my: 2, textAlign: "center", borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                <img src={event.cover_image.startsWith("http") ? event.cover_image : `/uploads/${event.cover_image}`} alt={event.title} style={{ display: 'block', width: "100%", height: isDialog ? 250 : 150, objectFit: "cover" }} />
            </Box>
            )}

            <Box sx={{ background: alpha(theme.palette.action.selected, 0.05), borderRadius: 2, p: 2, mb: 2, flexGrow: isDialog ? 0 : 1 }}>
            <Typography variant="body1" color="text.primary" sx={{ 
                maxHeight: isDialog ? 'none' : 70, // Limit height on card
                overflowY: isDialog ? 'auto' : 'hidden', // Scroll on dialog if needed, hidden on card
                WebkitLineClamp: isDialog ? 'none' : 3, // For card view
                WebkitBoxOrient: 'vertical', // For card view
                display: '-webkit-box', // For card view
                textOverflow: 'ellipsis', // For card view
                whiteSpace: 'normal', // Allow wrapping
            }}>
                {event.description}
            </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip icon={<EventIcon />} label={`Début: ${new Date(event.start_date).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}`} color="success" variant="outlined" size="small"/>
                <Chip icon={<CalendarMonthIcon />} label={`Fin: ${new Date(event.end_date).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}`} color="default" variant="outlined" size="small"/>
                <Chip icon={<PlaceIcon />} label={event.location} color="info" variant="outlined" size="small"/>
                {event.meeting_link && <Chip icon={<LinkIcon />} label="Lien Réunion" color="secondary" variant="outlined" component="a" href={event.meeting_link} target="_blank" rel="noopener noreferrer" clickable size="small"/>}
            </Stack>
        </Box>
        
        {/* Bottom section, pushes to bottom if isDialog is true */}
        <Box sx={{ mt: isDialog ? 'auto' : 0 }}> 
            {isDialog && (
                <>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip label={`Max Participants: ${event.max_participants || "∞"}`} color="default" size="small" variant="outlined"/>
                    <Chip label={event.is_public ? "Public" : "Privé"} color={event.is_public ? "success" : "warning"} size="small" variant="outlined"/>
                    <Chip label={event.requires_registration ? "Inscription requise" : "Libre"} color={event.requires_registration ? "primary" : "default"} size="small" variant="outlined"/>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}><GroupIcon sx={{ fontSize: 18, mr: 1, color: "primary.main" }} />Participants ({event.users_count || 0})</Typography>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                        {users.length > 0 ? (
                            users.map((user) => (
                            <Tooltip key={user.id} title={`${user.first_name} ${user.last_name}`} arrow>
                                <Avatar src={user.profile_image} alt={`${user.first_name} ${user.last_name}`} sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.light, 0.5), border: `1px solid ${theme.palette.divider}`, m: 0.25 }}/>
                            </Tooltip>
                            ))
                        ) : (<Typography variant="body2" color="text.secondary">Aucun participant pour le moment.</Typography>)}
                    </Stack>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}><CommentIcon sx={{ fontSize: 18, mr: 1, color: "primary.main" }} />Feedbacks ({feedback.length})</Typography>
                    {feedback.length > 0 ? (
                        <Stack spacing={1.5}>
                        {displayedFeedbackItems.map((fb) => (
                            <Paper key={fb.id} elevation={0} sx={{ display: "flex", alignItems: "center", background: alpha(theme.palette.grey[100], 0.5), borderRadius: 2, p: 1.5, border: `1px solid ${theme.palette.divider}`}}>
                                <Avatar src={fb.profileImage} alt={fb.nameId} sx={{ width: 32, height: 32, mr: 1.5, bgcolor: alpha(theme.palette.primary.light, 0.3) }}/>
                                <Box sx={{ flex: 1 }}><Typography variant="body2" fontWeight={600}>{fb.nameId}</Typography><Typography variant="caption" color="text.secondary">{fb.comment}</Typography></Box>
                                <Chip icon={<StarRateIcon />} label={fb.rating} color="warning" size="small" sx={{ ml: 1, bgcolor: alpha(theme.palette.warning.light, 0.2) }}/>
                            </Paper>
                        ))}
                        {/* Feedback Pagination Buttons */}
                        {feedback.length > feedbackPerPage && (
                            <Stack direction="row" justifyContent="center" spacing={1} sx={{mt: 1}}>
                                {currentFeedbackPage > 0 && (
                                    <Button size="small" onClick={handlePrevFeedback} startIcon={<ExpandLessIcon/>}>Précédent</Button>
                                )}
                                { (currentFeedbackPage + 1) * feedbackPerPage < feedback.length && (
                                    <Button size="small" onClick={handleNextFeedback} endIcon={<ExpandMoreIcon/>}>Voir plus</Button>
                                )}
                            </Stack>
                        )}
                        </Stack>
                    ) : (<Typography variant="body2" color="text.secondary">Aucun feedback pour cet événement.</Typography>)}
                </Box>
                </>
            )}
        </Box>
      </Box>
    );
  }


  return (
    <Container maxWidth="lg" sx={{ mt: {xs: 3, sm:6}, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} align="center" gutterBottom component={motion.div} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} color="text.primary">
        Événements Publics
      </Typography>

      {events.length === 0 && !loading && (
         <Typography align="center" color="text.secondary" sx={{mt: 5, fontStyle: 'italic'}}>Aucun événement public disponible pour le moment.</Typography>
      )}

      {events.length > 0 && (
        <Box sx={{ position: 'relative', mt: 4 }}>
          <IconButton onClick={handlePrev} sx={{ position: "absolute", left: { xs: -15, sm: -40, md: -60 }, top: "50%", transform: "translateY(-50%)", zIndex: 2, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, "&:hover": { bgcolor: theme.palette.action.hover }, boxShadow: theme.shadows[2] }} aria-label="Précédent">
            <ArrowBackIosNewIcon fontSize="small"/>
          </IconButton>
          <IconButton onClick={handleNext} sx={{ position: "absolute", right: { xs: -15, sm: -40, md: -60 }, top: "50%", transform: "translateY(-50%)", zIndex: 2, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, "&:hover": { bgcolor: theme.palette.action.hover }, boxShadow: theme.shadows[2] }} aria-label="Suivant">
            <ArrowForwardIosIcon fontSize="small"/>
          </IconButton>

          <Grid container spacing={isMobile ? 2 : 4} justifyContent="center" alignItems="stretch"> {/* alignItems="stretch" for equal height cards */}
            {displayedEvents.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={event ? event.id : `empty-${index}-${currentPage}`} sx={{ display: 'flex', justifyContent: 'center', transform: { md: index === 1 ? 'scale(1.03)' : 'scale(0.97)' }, zIndex: { md: index === 1 ? 1 : 0 }, transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)', my: { xs: 1, md: 0 } }}>
                {event ? (
                  <Paper elevation={index === 1 ? 6 : 3} sx={eventCardStyle} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                    {renderEventContent(event, false)}
                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      <Divider sx={{ mb: 1.5 }} />
                       <Button fullWidth variant="outlined" color="primary" onClick={() => handleOpenDetailsDialog(event)} startIcon={<ReadMoreIcon/>} sx={{mb:1, fontWeight: 500, textTransform: 'none', borderRadius: 1.5}}>
                        Plus de détails
                      </Button>
                      <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 600, textTransform: 'none', borderRadius: 1.5 }} onClick={() => handleJoin(event.id)} startIcon={<GroupIcon />}>
                        Rejoindre l'événement
                      </Button>
                    </Box>
                  </Paper>
                ) : (
                  // Render a visually hidden box to maintain layout structure
                  <Box sx={{ ...eventCardStyle, opacity: 0, pointerEvents: 'none', visibility: 'hidden', border: 'none', boxShadow: 'none' }} />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {events.length > eventsPerPage && (
        <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mt: 4 }}>
          {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map((_, i) => (
            <IconButton key={i} size="small" onClick={() => setCurrentPage(i)} sx={{ p: 0.25, color: i === currentPage ? 'primary.main' : 'action.disabled' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'currentColor', transition: 'background-color 0.3s' }}/>
            </IconButton>
          ))}
        </Stack>
      )}

      {eventForDetails && (
        <Dialog
          fullScreen={isMobile}
          open={openDetailsDialog}
          onClose={handleCloseDetailsDialog}
          TransitionComponent={isMobile ? Transition : Zoom}
          aria-labelledby="event-details-dialog-title"
          PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3, maxHeight: isMobile ? '100dvh' : 'calc(100dvh - 64px)', width: isMobile ? '100%' : 'md' } }}
          maxWidth="md"
        >
          <DialogTitle id="event-details-dialog-title" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py:1.5, px:2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="div">{eventForDetails.title}</Typography>
                <IconButton edge="end" color="inherit" onClick={handleCloseDetailsDialog} aria-label="close"> <CloseIcon /> </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ p: {xs: 1.5, sm: 2, md: 3}, '&::-webkit-scrollbar': {width: '8px'}, '&::-webkit-scrollbar-thumb': {backgroundColor: theme.palette.action.selected, borderRadius: '4px'} }}>
            {renderEventContent(eventForDetails, true)}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Laisser un commentaire</Typography>
            <form onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(eventForDetails.id); }} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <TextField
                    label="Votre commentaire"
                    variant="outlined"
                    size="small"
                    value={selectedEventIdForComment === eventForDetails.id ? comment : ""}
                    onChange={handleCommentChange}
                    onClick={() => setSelectedEventIdForComment(eventForDetails.id)}
                    fullWidth
                    multiline
                    rows={isMobile ? 2 : 3}
                    sx={{ background: alpha(theme.palette.action.hover, 0.5), borderRadius: 1 }}
                />
                <Button type="submit" variant="contained" color="primary" size="medium" endIcon={<SendIcon />} sx={{height: 'fit-content', mt: isMobile ? 1 : 0, whiteSpace: 'nowrap'}}>
                    Envoyer
                </Button>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: {xs: 1, sm: 2}, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button onClick={handleCloseDetailsDialog} color="inherit">Fermer</Button>
            <Button onClick={() => {handleJoin(eventForDetails.id); handleCloseDetailsDialog();}} variant="contained" color="primary" startIcon={<GroupIcon />}>
              Rejoindre
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default PublicEvents;
