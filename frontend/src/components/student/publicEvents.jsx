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
} from "@mui/material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { axiosInstance } from "../../apiConfig/axios";
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

function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/api/public-events");
        setEvents(res.data);
      } catch (err) {
        toast.error("Erreur lors de la récupération des événements publics.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = async (eventId) => {
    // TODO: Implement comment submit logic (API call)
    toast.success("Commentaire envoyé !");
    setComment("");
    setSelectedEvent(null);
  };

  const handleJoin = (eventId) => {
    // TODO: Implement join event logic (API call)
    toast.success("Demande de participation envoyée !");
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        align="center"
        gutterBottom
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Événements Publics
      </Typography>
      {events.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { xs: 0, sm: -60 },
              zIndex: 2,
              bgcolor: "#fff",
              border: "1px solid #e3e8ee",
              "&:hover": { bgcolor: "#e3e8ee" },
              display: { xs: "none", sm: "flex" }
            }}
            aria-label="Précédent"
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: "#f9fbfd",
                  minHeight: 480,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid #e3e8ee",
                  boxShadow: "0 4px 24px rgba(25,118,210,0.07)",
                  maxWidth: 600,
                  mx: "auto",
                }}
                component={motion.div}
                key={events[currentIndex].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Club & Event Info */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar
                    src={events[currentIndex].club?.logo}
                    alt={events[currentIndex].club?.name}
                    sx={{ width: 56, height: 56, bgcolor: "primary.main", border: "2px solid #fff" }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {events[currentIndex].title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Organisé par : {events[currentIndex].club?.name}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<GroupIcon />}
                    label={`${events[currentIndex].users_count} participants`}
                    color="primary"
                    sx={{ ml: "auto", fontWeight: 600, px: 1.5 }}
                  />
                </Stack>
                {/* Club Description & Rules */}
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InfoIcon color="info" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {events[currentIndex].club?.description}
                    </Typography>
                  </Stack>
                  {events[currentIndex].club?.rules && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <RuleIcon color="warning" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        {events[currentIndex].club.rules}
                      </Typography>
                    </Stack>
                  )}
                </Box>
                {/* Event Cover Image */}
                {events[currentIndex].cover_image && (
                  <Box sx={{ mb: 2, textAlign: "center" }}>
                    <img
                      src={
                        events[currentIndex].cover_image.startsWith("http")
                          ? events[currentIndex].cover_image
                          : `/uploads/${events[currentIndex].cover_image}`
                      }
                      alt={events[currentIndex].title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 180,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #e3e8ee",
                      }}
                    />
                  </Box>
                )}
                {/* Event Description */}
                <Box
                  sx={{
                    background: "#f7fafd",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    minHeight: 60,
                    border: "1px solid #e3e8ee",
                  }}
                >
                  <Typography variant="body1">{events[currentIndex].description}</Typography>
                </Box>
                {/* Event Details */}
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    icon={<EventIcon />}
                    label={new Date(events[currentIndex].start_date).toLocaleString("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip
                    icon={<CalendarMonthIcon />}
                    label={
                      "Fin : " +
                      new Date(events[currentIndex].end_date).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    }
                    color="default"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip
                    icon={<PlaceIcon />}
                    label={events[currentIndex].location}
                    color="info"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                  {events[currentIndex].meeting_link && (
                    <Chip
                      icon={<LinkIcon />}
                      label="Lien"
                      color="secondary"
                      variant="outlined"
                      component="a"
                      href={events[currentIndex].meeting_link}
                      target="_blank"
                      clickable
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Stack>
                {/* Max Participants, Registration, Public */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={`Max: ${events[currentIndex].max_participants || "∞"}`}
                    color="default"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={events[currentIndex].is_public ? "Public" : "Privé"}
                    color={events[currentIndex].is_public ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={events[currentIndex].requires_registration ? "Inscription requise" : "Libre"}
                    color={events[currentIndex].requires_registration ? "primary" : "default"}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Divider sx={{ my: 2 }} />
                {/* Users List */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    <GroupIcon sx={{ fontSize: 18, mr: 1, color: "#1976d2" }} />
                    Participants
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {events[currentIndex].users && events[currentIndex].users.length > 0 ? (
                      events[currentIndex].users.map((user) => (
                        <Tooltip
                          key={user.id}
                          title={`${user.first_name} ${user.last_name}`}
                          arrow
                        >
                          <Avatar
                            src={user.profile_image}
                            alt={`${user.first_name} ${user.last_name}`}
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "#e3f2fd",
                              border: "1px solid #e3e8ee",
                              mr: 0.5,
                            }}
                          />
                        </Tooltip>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucun participant pour le moment.
                      </Typography>
                    )}
                  </Stack>
                </Box>
                <Divider sx={{ my: 2 }} />
                {/* Feedbacks */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    <CommentIcon sx={{ fontSize: 18, mr: 1, color: "#1976d2" }} />
                    Feedbacks
                  </Typography>
                  {events[currentIndex].feedback && events[currentIndex].feedback.length > 0 ? (
                    <Stack spacing={1}>
                      {events[currentIndex].feedback.map((fb) => (
                        <Paper
                          key={fb.id}
                          elevation={0}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            background: "#f4f7fa",
                            borderRadius: 2,
                            p: 1.2,
                            border: "1px solid #e3e8ee",
                          }}
                        >
                          <Avatar
                            src={fb.profileImage}
                            alt={fb.nameId}
                            sx={{ width: 32, height: 32, mr: 1, bgcolor: "#e3f2fd" }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600} color="primary.dark">
                              {fb.nameId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {fb.comment}
                            </Typography>
                          </Box>
                          <Chip
                            icon={<StarRateIcon sx={{ color: "#fbc02d" }} />}
                            label={fb.rating}
                            color="warning"
                            size="small"
                            sx={{ ml: 1, fontWeight: 600, bgcolor: "#fffbe6" }}
                          />
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Aucun feedback pour cet événement.
                    </Typography>
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />
                {/* Comment Form & Join Button */}
                <Box sx={{ mt: 1 }}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSelectedEvent(events[currentIndex].id);
                      handleCommentSubmit(events[currentIndex].id);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <TextField
                      label="Ajouter un commentaire"
                      variant="outlined"
                      size="small"
                      value={selectedEvent === events[currentIndex].id ? comment : ""}
                      onChange={handleCommentChange}
                      sx={{
                        flex: 1,
                        background: "#f7fafd",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                    />
                    <Tooltip title="Envoyer le commentaire">
                      <span>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 600, px: 3, minWidth: 0 }}
                          endIcon={<SendIcon />}
                        >
                          Commenter
                        </Button>
                      </span>
                    </Tooltip>
                  </form>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      mt: 2,
                      width: "100%",
                      fontWeight: 600,
                      borderRadius: 2,
                      bgcolor: "#f7fafd",
                      border: "1.5px solid #1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        bgcolor: "#e3f2fd",
                        borderColor: "#1565c0",
                      },
                    }}
                    onClick={() => handleJoin(events[currentIndex].id)}
                    startIcon={<GroupIcon />}
                  >
                    Rejoindre l'événement
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 0, sm: -60 },
              zIndex: 2,
              bgcolor: "#fff",
              border: "1px solid #e3e8ee",
              "&:hover": { bgcolor: "#e3e8ee" },
              display: { xs: "none", sm: "flex" }
            }}
            aria-label="Suivant"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}
      {/* Dots navigation for mobile */}
      <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 3 }}>
        {events.map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: i === currentIndex ? "primary.main" : "#e3e8ee",
              transition: "all 0.3s",
            }}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default PublicEvents;