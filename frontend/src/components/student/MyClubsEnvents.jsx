import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Divider,
  Pagination,
  useTheme,
  CssBaseline,
  Skeleton,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Badge,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Filter, ExternalLink, Star, X, Zap } from "lucide-react";
import { axiosInstance } from "../../apiConfig/axios";
import toast from "react-hot-toast";

const MotionCard = motion(Card);
const ITEMS_PER_PAGE = window.innerWidth >= 900 ? 6 : 3;


export default function MyClubsEnvents() {
  const theme = useTheme();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  // Responsive: update items per page on resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 900 ? 6 : 3);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For event filtering
  const allEvents = clubs.flatMap((c) =>
    (c.club.events || []).map((event) => ({
      ...event,
      clubName: c.club.name,
      clubLogo: c.club.logo,
      userRole: c.role,
    }))
  );
  const filteredEvents =
    selectedFilter === "all"
      ? allEvents
      : selectedFilter === "upcoming"
      ? allEvents.filter((e) => new Date(e.start_date) > new Date())
      : selectedFilter === "today"
      ? allEvents.filter(
          (e) => new Date(e.start_date).toDateString() === new Date().toDateString()
        )
      : selectedFilter === "registration"
      ? allEvents.filter((e) => e.requires_registration)
      : allEvents;

  const colors = {
    primary100: "#2e8b57",
    primary200: "#61bc84",
    primary300: "#c6ffe6",
    accent100: "#61bc84",
    accent200: "#005d2d",
    text100: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
    text200: theme.palette.mode === "dark" ? "#dddddd" : "#2c2c2c",
    bg100: theme.palette.mode === "dark" ? "#121212" : "#effff6",
    bg200: theme.palette.mode === "dark" ? "#1e1e1e" : "#e5f5ec",
    bg300: theme.palette.mode === "dark" ? "#333333" : "#bcccc3",
  };

  useEffect(() => {
    const fetchClubsEvents = async () => {
      setLoading(true);
      try {
        // Uncomment for real API
        const res = await axiosInstance.get("/api/getMyClubsEvents");
        setClubs(res.data?.clubs || []);
      } catch (err) {
        toast.error("Erreur lors de la récupération des Clubs et des événements.");
      } finally {
        setLoading(false);
      }
    };
    fetchClubsEvents();
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  const filterOptions = [
    { value: "all", label: "Tous", count: allEvents.length },
    {
      value: "upcoming",
      label: "À venir",
      count: allEvents.filter((e) => new Date(e.start_date) > new Date()).length,
    },
    {
      value: "today",
      label: "Aujourd'hui",
      count: allEvents.filter(
        (e) => new Date(e.start_date).toDateString() === new Date().toDateString()
      ).length,
    },
    {
      value: "registration",
      label: "Inscription requise",
      count: allEvents.filter((e) => e.requires_registration).length,
    },
  ];

  // Card fixed size
  const cardWidth = 400;
  const cardHeight = 550;
  const imageHeight = 250;

  return (
    <Box sx={{ minHeight: "100vh", py: 5 }}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            color: colors.primary100,
            mb: 3,
            fontSize: { xs: "1.5rem", md: "2.3rem" },
            letterSpacing: "-1px",
          }}
        >
          Mes Événements de Clubs
        </Typography>
        <Typography
          align="center"
          sx={{
            color: colors.text200,
            mb: 4,
            fontSize: { xs: "1rem", md: "1.2rem" },
            fontWeight: 500,
          }}
        >
          Retrouvez ici tous les événements de vos clubs universitaires.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
          <Button
            variant="contained"
            startIcon={<Filter />}
            onClick={() => setFilterPopupOpen(true)}
            sx={{
              background: `linear-gradient(135deg, ${colors.primary100} 0%, ${colors.accent200} 100%)`,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              textTransform: "none",
              px: 4,
              py: 1.5,
              boxShadow: 2,
              "&:hover": {
                background: `linear-gradient(135deg, ${colors.accent200} 0%, ${colors.primary100} 100%)`,
              },
            }}
          >
            Filtres
          </Button>
        </Stack>

        <Dialog
          open={filterPopupOpen}
          onClose={() => setFilterPopupOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>Filtres d'événements</span>
            <IconButton onClick={() => setFilterPopupOpen(false)}>
              <X />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Catégories
              </FormLabel>
              <RadioGroup
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                sx={{ gap: 2 }}
              >
                {filterOptions.map((option) => (
                  <Box
                    key={option.value}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: 1,
                      borderColor:
                        selectedFilter === option.value
                          ? colors.primary100
                          : colors.bg300,
                      bgcolor:
                        selectedFilter === option.value
                          ? colors.primary300
                          : colors.bg200,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControlLabel
                      value={option.value}
                      control={<Radio color="primary" />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span style={{ fontWeight: 500 }}>{option.label}</span>
                          <Badge
                            badgeContent={option.count}
                            color="primary"
                            sx={{
                              "& .MuiBadge-badge": {
                                fontWeight: 700,
                                fontSize: "0.9em",
                              },
                            }}
                          />
                        </Stack>
                      }
                      sx={{ margin: 0, width: "100%" }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setFilterPopupOpen(false)}
                sx={{
                  background: `linear-gradient(135deg, ${colors.primary100} 0%, ${colors.accent200} 100%)`,
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                Appliquer
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSelectedFilter("all");
                  setFilterPopupOpen(false);
                }}
                sx={{
                  borderColor: colors.primary100,
                  color: colors.primary100,
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                Réinitialiser
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={idx} sx={{ display: "flex", justifyContent: "center" }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      width: cardWidth,
                      height: cardHeight,
                      display: "flex",
                      flexDirection: "column",
                      mx: "auto",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={cardWidth}
                      height={imageHeight}
                      sx={{
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Skeleton height={30} width="40%" />
                      <Skeleton height={20} width="60%" />
                      <Skeleton height={20} width="80%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : paginatedEvents.map((event, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={event.id} sx={{ display: "flex", justifyContent: "center" }}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    sx={{
                      borderRadius: 3,
                      backgroundColor: colors.bg200,
                      boxShadow: 3,
                      overflow: "hidden",
                      width: cardWidth,
                      height: cardHeight,
                      display: "flex",
                      flexDirection: "column",
                      mx: "auto",
                    }}
                  >
                    <Box sx={{ position: "relative", width: "100%" }}>
                      <CardMedia
                        component="img"
                        image={event.cover_image}
                        alt={event.title}
                        sx={{
                          width: "100%",
                          height: imageHeight,
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      />
                      <Avatar
                        src={event.clubLogo}
                        alt={event.clubName}
                        sx={{
                          width: 56,
                          height: 56,
                          position: "absolute",
                          bottom: -28,
                          left: 20,
                          border: "3px solid white",
                          boxShadow: 2,
                          bgcolor: colors.primary100,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ pt: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.primary100,
                            fontWeight: 700,
                            fontSize: { xs: "1.1rem", md: "1.15rem" },
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Chip
                          label={event.userRole}
                          size="small"
                          sx={{
                            backgroundColor: colors.primary200,
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text200,
                          mb: 1,
                          fontSize: { xs: "0.98rem", md: "1.05rem" },
                        }}
                      >
                        {event.description}
                      </Typography>
                      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                        <Chip
                          icon={<Calendar size={18} />}
                          label={new Date(event.start_date).toLocaleDateString("fr-FR", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          sx={{ bgcolor: colors.bg300, fontWeight: 600 }}
                        />
                        <Chip
                          icon={<Clock size={18} />}
                          label={`${new Date(event.start_date).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${new Date(event.end_date).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`}
                          sx={{ bgcolor: colors.bg300, fontWeight: 600 }}
                        />
                        {event.location && (
                          <Chip
                            icon={<MapPin size={18} />}
                            label={event.location}
                            sx={{ bgcolor: colors.bg300, fontWeight: 600 }}
                          />
                        )}
                        {event.meeting_link && (
                          <Chip
                            icon={<ExternalLink size={18} />}
                            label="Lien"
                            component="a"
                            href={event.meeting_link}
                            target="_blank"
                            clickable
                            sx={{ bgcolor: colors.bg300, fontWeight: 600 }}
                          />
                        )}
                      </Stack>
                      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                        <Chip
                          icon={<Users size={18} />}
                          label={`Max: ${event.max_participants || "∞"}`}
                          sx={{ bgcolor: colors.bg100, fontWeight: 600 }}
                        />
                        <Chip
                          icon={<Star size={18} />}
                          label={event.is_public ? "Public" : "Privé"}
                          color={event.is_public ? "success" : "warning"}
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip
                          label={event.requires_registration ? "Inscription requise" : "Libre"}
                          color={event.requires_registration ? "primary" : "default"}
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip
                          icon={<Zap size={18} />}
                          label={
                            new Date() < new Date(event.start_date)
                              ? "À venir"
                              : new Date() > new Date(event.end_date)
                              ? "Terminé"
                              : "En cours"
                          }
                          color={
                            new Date() < new Date(event.start_date)
                              ? "info"
                              : new Date() > new Date(event.end_date)
                              ? "default"
                              : "success"
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                      <Divider sx={{ my: 1, bgcolor: colors.bg300 }} />
                      <Typography
                        variant="caption"
                        sx={{ color: colors.text200, fontSize: "0.95em" }}
                      >
                        Club : <b>{event.clubName}</b>
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
        </Grid>

        {!loading && filteredEvents.length > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
