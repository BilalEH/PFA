import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  Pagination, // Added for pagination
  useMediaQuery, // Added for responsiveness
} from '@mui/material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../apiConfig/axios'; // Ensure this path is correct
import { csrfRequest } from '../../apiConfig/csrfHelper';

// Icons
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'; // Default icon
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread'; // For Mark as Read
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Softer delete icon

// Helper function to get an icon based on notification type
const getNotificationIcon = (type, theme) => {
  switch (type?.toLowerCase()) {
    case 'event_reminder':
    case 'event':
      return <EventAvailableIcon sx={{ color: theme.palette.primary.main }} />;
    case 'announcement':
      return <InfoOutlinedIcon sx={{ color: theme.palette.info.main }} />;
    case 'success':
      return <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main }} />;
    case 'error':
    case 'alert':
      return <ErrorOutlineIcon sx={{ color: theme.palette.error.main }} />;
    default:
      return <NotificationsNoneIcon sx={{ color: theme.palette.text.secondary }} />;
  }
};

export const Notifications = () => {


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsive logic

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1); // MUI Pagination is 1-indexed
  const notificationsPerPageMobile = 5;
  const notificationsPerPageDesktop = 15;
  const itemsPerPage = isMobile ? notificationsPerPageMobile : notificationsPerPageDesktop;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // await csrfRequest('get', "/sanctum/csrf-cookie"); // If needed
      const res = await axiosInstance.get("/api/user/notifications");
      const data = Array.isArray(res.data) ? res.data : [];
      data.sort((a, b) => {
        if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setNotifications(data);
      if (data.length === 0) {
        toast.success("Boîte de réception vide !", { icon: '🎉' });
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
      toast.error("Erreur lors de la récupération des notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId, e) => {
    if (e) e.stopPropagation();

    const originalNotifications = JSON.parse(JSON.stringify(notifications)); // Deep copy
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
    toast.success("Notification marquée comme lue.", { icon: '👍' });

    try {
      await csrfRequest('patch', `/api/user/notifications/${notificationId}`); // Using your helper
    } catch (error) {
      toast.error("Erreur: non marquée comme lue.");
      setNotifications(originalNotifications);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    if (e) e.stopPropagation();
    
    const originalNotifications = JSON.parse(JSON.stringify(notifications)); // Deep copy
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success("Notification supprimée.", { icon: '🗑️' });
    
    try {
      await axiosInstance.delete(`/api/user/notifications/${notificationId}`);
    } catch (error) {
      toast.error("Erreur: non supprimée.");
      setNotifications(originalNotifications);
    }
  };

  // Pagination calculations
  const indexOfLastNotification = currentPage * itemsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - itemsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);
  const pageCount = Math.ceil(notifications.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } },
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={{xs: 3, sm: 4}}
          component={motion.div}
          variants={itemVariants}
        >
          <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Chip
              label={`${notifications.filter(n => !n.is_read).length} non lues`}
              color="primary"
              size={isMobile ? "small" : "medium"}
              icon={<NotificationsNoneIcon />}
              sx={{
                boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.25)}`,
                fontWeight: 600,
                borderRadius: '16px',
              }}
            />
          )}
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress thickness={4} size={50}/>
          </Box>
        ) : notifications.length > 0 ? (
          <>
            <Paper
              elevation={0}
              component={motion.div}
              variants={itemVariants}
              sx={{
                borderRadius: '12px', // Slightly reduced for a tighter look
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper, // Solid background
              }}
            >
              <List disablePadding>
                {currentNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <motion.div variants={itemVariants}>
                      <ListItem
                        button={!!notification.link}
                        // component={notification.link ? 'a' : 'div'}
                        component={'div'} // Changed to 'div' for better accessibility
                        // href={notification.link || undefined}
                        // target={notification.link ? '_blank' : undefined}
                        // rel={notification.link ? 'noopener noreferrer' : undefined}
                        sx={{
                          py: {xs: 2, sm: 2.5},
                          px: { xs: 1.5, sm: 2.5 },
                          cursor: notification.link ? 'pointer' : 'default',
                          bgcolor: notification.is_read
                            ? 'transparent'
                            : alpha(theme.palette.primary.main, 0.05), // Even more subtle
                          transition: 'background-color 0.2s ease-out',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.action.hover, 0.05),
                          },
                          textDecoration: 'none',
                          color: 'inherit',
                          position: 'relative',
                        }}
                      >
                        {!notification.is_read && (
                           <Box sx={{
                              width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main',
                              position: 'absolute', left: {xs: 10, sm: 12}, top: '50%', transform: 'translateY(-50%)'
                           }}/>
                        )}
                        <ListItemIcon sx={{ 
                            minWidth: 32, mr: 1.5, 
                            pl: notification.is_read ? 0 : {xs: 1, sm: 1.5} 
                        }}>
                          {getNotificationIcon(notification.type, theme)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: notification.is_read ? 500 : 600, color: 'text.primary', lineHeight: 1.45 }}>
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5, lineHeight: 1.5, 
                                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' // Limit message to 2 lines
                              }}>
                                {notification.message}
                              </Typography>
                              <Typography component="span" variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.75) }}>
                                {notification.created_at ? new Date(notification.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Date inconnue'}
                              </Typography>
                            </>
                          }
                        />
                        <Stack direction="row" spacing={0.25} sx={{ ml: 1, alignItems: 'center' }}>
                          {!notification.is_read && (
                            <Tooltip title="Marquer comme lue">
                              <IconButton size="small" onClick={(e) => handleMarkAsRead(notification.id, e)}
                                sx={{ borderRadius: '50%', '&:hover': { color: theme.palette.primary.dark, bgcolor: alpha(theme.palette.primary.main, 0.12) } }}>
                                <MarkAsUnreadIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Supprimer">
                            <IconButton size="small" onClick={(e) => handleDeleteNotification(notification.id, e)}
                              sx={{ borderRadius: '50%', '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) } }}>
                              <DeleteOutlineIcon fontSize="small" sx={{color: theme.palette.text.disabled}}/>
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </ListItem>
                    </motion.div>
                    {index < currentNotifications.length - 1 && <Divider variant="inset" component="li" sx={{borderColor: alpha(theme.palette.divider, 0.7)}} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
            {pageCount > 1 && (
              <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                <Pagination
                  count={pageCount}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton={!isMobile}
                  showLastButton={!isMobile}
                />
              </Stack>
            )}
          </>
        ) : (
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', py: {xs: 6, sm: 10} }}>
              <NotificationsNoneIcon sx={{ fontSize: { xs: 50, sm: 70 }, color: alpha(theme.palette.text.primary, 0.25), mb: 2.5 }} />
              <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                Boîte de réception vide
              </Typography>
              <Typography color="text.disabled" variant="body1">
                Aucune nouvelle notification pour le moment.
              </Typography>
            </Box>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};
