import { useState, useEffect } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { axiosInstance } from "../../apiConfig/axios";
import LoadingScreen from "../ui/LoadingScreen";

const MotionCard = motion(Card);
const ITEMS_PER_PAGE = 3;

export function MyClubsList() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const theme = useTheme();

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
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/userClubs");
        setClubs(res.data?.clubs || []);
      } catch (err) {
        toast.error("Erreur lors de la récupération des Clubs.");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const totalPages = Math.ceil(clubs.length / ITEMS_PER_PAGE);
  const paginatedClubs = clubs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

    if (loading && clubs.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <LoadingScreen />
      </Box>
    );
    }
    if (clubs.length === 0 && !loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" sx={{ color: colors.text200 }}>
          Aucun Club trouvé.
        </Typography>
      </Box>
    );
    }

  return (
    <>
      <CssBaseline />
      <Box sx={{ backgroundColor: colors.bg100, minHeight: "100vh", py: 5 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              color: colors.primary100,
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Mes Clubs Universitaires
          </Typography>

          <Grid container spacing={4}>
            {loading
              ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Card sx={{ borderRadius: 3 }}>
                      <Skeleton variant="rectangular" height={180} />
                      <CardContent>
                        <Skeleton height={30} width="40%" />
                        <Skeleton height={20} width="60%" />
                        <Skeleton height={20} width="80%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : paginatedClubs.map(({ club, role }, index) => (
                  <Grid item xs={12} key={club.id}>
                    <MotionCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: colors.bg200,
                        boxShadow: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ position: "relative", paddingTop: "56.25%" /* 16:9 */ }}>
                        <CardMedia
                            component="img"
                            image={club.cover_image}
                            alt={club.name}
                            sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            }}
                        />
                        <Avatar
                          src={club.logo}
                          alt={club.name}
                          sx={{
                            width: 80,
                            height: 80,
                            position: "absolute",
                            bottom: -30,
                            left: 20,
                            border: "3px solid white",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ pt: 4 }}>
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
                            sx={{ color: colors.primary100 }}
                          >
                            {club.name}
                          </Typography>
                          <Chip
                            label={role}
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
                          sx={{ color: colors.text200, mb: 1 }}
                        >
                          {club.description}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: colors.text200 }}
                        >
                          📅 Fondé le{" "}
                          {new Date(club.foundation_date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>

                        <Divider sx={{ my: 2, bgcolor: colors.bg300 }} />

                        <Typography
                          variant="body2"
                          sx={{ color: colors.text200 }}
                        >
                          🔒 <strong>Règles :</strong>{" "}
                          {club.rules.length > 90
                            ? club.rules.slice(0, 90) + "..."
                            : club.rules}
                        </Typography>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
          </Grid>

          {!loading && clubs.length > ITEMS_PER_PAGE && (
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
    </>
  );
}
