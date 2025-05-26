import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  useMediaQuery,
  Pagination,
  Fade,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Drawer
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";
import { axiosInstance } from "../../apiConfig/axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import LoadingScreen from "../ui/LoadingScreen";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(3);
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get("/api/userApplications");
        setApplications(response.data.applications);
        setFilteredApplications(response.data.applications);
      } catch (err) {
        console.error("Error fetching applications:", err);
        toast.error("Erreur lors de la récupération des candidatures.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter));
    }
    setPage(1);
  }, [statusFilter, applications]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const applyFilters = () => {
    setFilterOpen(false);
  };

  const paginatedApps = filteredApplications.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'row',
      px: isMobile ? 2 : 4,
      py: 6,
      position: 'relative'
    }}>
      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1,
        pr: filterOpen && !isMobile ? '400px' : 0,
        transition: 'padding-right 0.3s ease'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            Mes candidatures aux clubs
          </Typography>
          
          <Button 
            startIcon={<FilterListIcon />} 
            onClick={toggleFilter}
            variant="outlined"
          >
            Filtres
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {filteredApplications.length === 0 ? (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {statusFilter === "all" 
                  ? "Vous n'avez soumis aucune candidature pour l'instant."
                  : `Aucune candidature avec le statut "${statusFilter === 'pending' ? 'En attente' : statusFilter === 'approved' ? 'Approuvée' : 'Rejetée'}" trouvée.`}
              </Typography>
            </Box>
          </Fade>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedApps.map((app, index) => (
                <Grid item xs={12} key={app.id}>
                  <Grow in timeout={500 + (index * 100)}>
                    <Paper
                      elevation={2}
                      sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "flex-start" : "center",
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f9f9f9",
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Avatar
                        src={app.club.logo}
                        alt={app.club.name}
                        sx={{ width: 64, height: 64 }}
                        variant="rounded"
                      />

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {app.club.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {app.club.description}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="subtitle2" gutterBottom>
                          📩 Motivation :
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                          {app.motivation}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 1 }}
                        >
                          📅 Déposé le : {dayjs(app.created_at).locale("fr").format("D MMMM YYYY à HH:mm")}
                        </Typography>
                      </Box>

                      <Chip
                        label={
                          app.status === "pending"
                            ? "En attente"
                            : app.status === "approved"
                            ? "Approuvée"
                            : "Rejetée"
                        }
                        color={
                          app.status === "pending"
                            ? "warning"
                            : app.status === "approved"
                            ? "success"
                            : "error"
                        }
                        variant="outlined"
                        sx={{
                          mt: isMobile ? 2 : 0,
                          alignSelf: isMobile ? "flex-start" : "center",
                        }}
                      />
                    </Paper>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            {filteredApplications.length > perPage && (
              <Box 
                sx={{
                  position: isMobile ? "static" : "fixed",
                  bottom: isMobile ? "auto" : "20px",
                  left: isMobile ? "auto" : "50%",
                  transform: isMobile ? "none" : "translateX(-50%)",
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  pb: isMobile ? 2 : 0,
                  width: isMobile ? "100%" : "auto"
                }}
              >
                <Slide direction="up" in>
                  <Pagination
                    count={Math.ceil(filteredApplications.length / perPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Slide>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Filter Panel - Desktop (Drawer) */}
      {!isMobile && (
        <Drawer
          anchor="right"
          open={filterOpen}
          onClose={toggleFilter}
          variant="persistent"
          sx={{
            '& .MuiDrawer-paper': {
              width: 350,
              boxSizing: 'border-box',
              p: 3,
              borderLeft: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4]
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Filtres</Typography>
            <IconButton onClick={toggleFilter}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="status-filter-label">Statut</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Statut"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">Tous les statuts</MenuItem>
              <MenuItem value="pending">En attente</MenuItem>
              <MenuItem value="approved">Approuvée</MenuItem>
              <MenuItem value="rejected">Rejetée</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            fullWidth
            onClick={applyFilters}
          >
            Appliquer les filtres
          </Button>
        </Drawer>
      )}

      {/* Filter Panel - Mobile (Dialog) */}
      {isMobile && (
        <Dialog
          fullScreen
          open={filterOpen}
          onClose={toggleFilter}
          TransitionComponent={Transition}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filtres</Typography>
            <IconButton onClick={toggleFilter}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="mobile-status-filter-label">Statut</InputLabel>
              <Select
                labelId="mobile-status-filter-label"
                value={statusFilter}
                label="Statut"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">Tous les statuts</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="approved">Approuvée</MenuItem>
                <MenuItem value="rejected">Rejetée</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleFilter}>Annuler</Button>
            <Button 
              variant="contained" 
              onClick={applyFilters}
              color="primary"
            >
              Appliquer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ApplicationList;