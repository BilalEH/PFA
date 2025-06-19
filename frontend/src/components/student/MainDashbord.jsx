import React, { useState, useEffect } from 'react';
import {
  Avatar, Box, Card, CardContent, Chip, List, ListItem,
  ListItemAvatar, ListItemText, Typography, IconButton, Skeleton,
  Stack, Button, useMediaQuery,
  Grid
} from '@mui/material';
import { Masonry } from '@mui/lab';
import { motion } from 'framer-motion';
import {
  Share, Groups, Event, Notifications, Email,
  Phone, Link as LinkIcon, ArrowForward, School, FilterList
} from '@mui/icons-material';
import { axiosInstance } from '../../apiConfig/axios';
import { Link } from 'react-router-dom';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12
    }
  },
};

// Skeleton Loader Component
const DashboardSkeleton = () => (
  <Box sx={{ p: 2, height: 'calc(100vh - 64px)' }}>
    <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={item} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={item % 2 === 0 ? 200 : 150} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      ))}
    </Masonry>
  </Box>
);

const DashboardStudent = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Échec du chargement du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)'
      }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  // Destructure with safe defaults
  const {
    user = {},
    clubs_count = 0,
    events_count = 0,
    feedback_count = 0,
    interviews_count = 0,
    notifications_count = 0
  } = dashboardData || {};

  // User data with defaults
  const {
    first_name = '',
    last_name = '',
    profile_image = '',
    branch = '',
    year_of_study = '',
    bio = '',
    phone_number = '',
    email = '',
    club_users = [],
    notifications = []
  } = user || {};

  // Format user name
  const fullName = `${first_name} ${last_name}`;

  const cards = [
    // Profile Card
    <motion.div key="profile" variants={itemVariants}>
      <Card sx={{ borderRadius: 3, boxShadow: 3  }} >
        <Box sx={{ 
          height: 100, 
          background: 'linear-gradient(135deg, #2e8b57 0%, #61bc84 100%)' 
        }} />
        <CardContent sx={{ position: 'relative' }}>
          <Avatar 
            src={profile_image} 
            alt={fullName} 
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2, 
              border: '4px solid white',
              boxShadow: 3,
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)'
            }} 
          />
          
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">{fullName}</Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {branch} • Année {year_of_study}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 2 }}>
            <Chip 
              icon={<Groups />} 
              label={`${clubs_count} Clubs`} 
              variant="outlined" 
            />
            <Chip 
              icon={<Event />} 
              label={`${events_count} Événements`} 
              variant="outlined" 
            />
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            {bio || "Aucune biographie disponible"}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            <IconButton color="primary" href={`mailto:${email}`}>
              <Email />
            </IconButton>
            <IconButton color="primary" href={`tel:${phone_number}`}>
              <Phone />
            </IconButton>
            <IconButton color="primary">
              <Share />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>,

    // Notifications Card
    <motion.div key="notifications" variants={itemVariants}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              <Notifications fontSize="small" sx={{ mr: 1 }} /> Notifications
              <Chip label={notifications_count} color="error" size="small" sx={{ ml: 1 }} />
            </Typography>
            <IconButton size="small"><FilterList /></IconButton>
          </Box>
          
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.length ? notifications.slice(0, 4).map((notif) => (
              <ListItem 
                key={notif.id} 
                divider 
                sx={{ 
                  px: 0,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Notifications />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notif.title}
                  secondary={notif.message}
                  primaryTypographyProps={{ 
                    fontWeight: notif.is_read ? 'normal' : 'bold',
                    fontSize: '0.9rem'
                  }}
                />
                {!notif.is_read && <Chip label="Nouveau" color="error" size="small" />}
              </ListItem>
            )) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Aucune notification
              </Typography>
            )}
          </List>
          
          <Button 
            variant="text" 
            fullWidth 
            endIcon={<ArrowForward />}
            sx={{ mt: 1 }}
            href="/student/notifications"
          >
            Voir toutes
          </Button>
        </CardContent>
      </Card>
    </motion.div>,

    // Activity Stats Card
    <motion.div key="activity" variants={itemVariants}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            <Event fontSize="small" sx={{ mr: 1 }} /> Mon Activité
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Clubs", value: clubs_count, color: "primary", icon: <Groups /> },
              { label: "Événements", value: events_count, color: "secondary", icon: <Event /> },
              { label: "Entretiens", value: interviews_count, color: "info", icon: <School /> },
              { label: "Retours", value: feedback_count, color: "success", icon: <Notifications /> }
            ].map((item, i) => (
              <Grid item xs={6} key={i}>
                <Card sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 2, 
                  bgcolor: `${item.color}.light`,
                  color: `${item.color}.contrastText`
                }}>
                  <Box sx={{ mb: 1 }}>{item.icon}</Box>
                  <Typography variant="h5" fontWeight="bold">{item.value}</Typography>
                  <Typography variant="body2">{item.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>,

    // Clubs Card
    <motion.div key="clubs" variants={itemVariants}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              <School fontSize="small" sx={{ mr: 1 }} /> Mes Clubs
            </Typography>
            <Link to="/student/club-dashboard" style={{ textDecoration: 'none' }}>
              <Button variant="text" size="small" endIcon={<ArrowForward />}>
                Tableau de bord
              </Button>
            </Link>
          </Box>
          
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {club_users.length ? club_users.map((club, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  px: 0,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <School />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Club ${club.club_id}`}
                  secondary={`Rôle: ${club.role.charAt(0).toUpperCase() + club.role.slice(1)}`}
                />
                <Chip 
                  label={club.is_active ? "Actif" : "Inactif"} 
                  color={club.is_active ? "success" : "error"} 
                  size="small" 
                />
              </ListItem>
            )) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Vous n'êtes membre d'aucun club
              </Typography>
            )}
          </List>
          
          <Button 
            variant="outlined" 
            fullWidth 
            endIcon={<ArrowForward />}
            sx={{ mt: 1 }}
            href="/student/clubs"
          >
            Explorer les clubs
          </Button>
        </CardContent>
      </Card>
    </motion.div>,

    // Resources Card
    <motion.div key="resources" variants={itemVariants}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            <LinkIcon fontSize="small" sx={{ mr: 1 }} /> Ressources
          </Typography>
          
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {[
              { title: 'Guide des clubs', description: 'Guide des activités de club', href: '/resources/handbook' },
              { title: 'Calendrier', description: 'Calendrier des événements', href: '/resources/calendar' },
              { title: 'Annuaire', description: 'Connectez-vous avec d\'autres étudiants', href: '/resources/directory' },
              { title: 'Formations', description: 'Ateliers et tutoriels', href: '/resources/training' },
              { title: 'Financement', description: 'Guide pour obtenir des fonds', href: '/resources/funding' }
            ].map((res, idx) => (
              <ListItem 
                key={idx} 
                component="a" 
                href={res.href}
                sx={{ 
                  px: 0,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                    <LinkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={res.title}
                  secondary={res.description}
                />
              </ListItem>
            ))}
          </List>
          
          <Button 
            variant="outlined" 
            fullWidth 
            endIcon={<ArrowForward />}
            sx={{ mt: 1 }}
            href="/resources"
          >
            Explorer les ressources
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  ];

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      p: 2,
      overflow: 'auto'
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Masonry
          columns={{ xs: 1, sm: 2, md: 2 }} 
          spacing={3}
          sx={{ width: 'auto' }}
        >
          {cards}
        </Masonry>
      </motion.div>
    </Box>
  );
};

export default DashboardStudent;