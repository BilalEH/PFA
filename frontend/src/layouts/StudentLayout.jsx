import React, { useEffect, useState, useMemo } from 'react';
import { Link as RouterLink, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, useMediaQuery, Avatar, Menu, MenuItem, Divider, Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Group as GroupIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon // Kept for potential future use
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../apiConfig/axios'; // Actual import
import LoadingScreen from '../components/ui/LoadingScreen'; // Actual import
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';

const drawerWidth = 250;
const collapsedDrawerWidth = 60;
const appBarHeight = '64px'; // Standard AppBar height

// Color definitions from your palette
const colors = {
  primary100: '#2e8b57', // Sea Green
  primary200: '#61bc84', // Lighter Sea Green
  primary300: '#c6ffe6', // Very Light Mint Green
  accent100: '#61bc84',  // Same as primary200 for accent
  accent200: '#005d2d',  // Darker Sea Green
  text100: '#000000',    // Black
  text200: '#2c2c2c',    // Dark Gray
  bg100: '#effff6',      // Very Light Mint background
  bg200: '#e5f5ec',      // Light Mint background
  bg300: '#bcccc3',      // Light Grayish Mint for dividers
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: colors.primary100,
            light: colors.primary200,
            dark: colors.accent200,
          },
          secondary: {
            main: colors.accent100,
            light: colors.primary300,
          },
          background: {
            default: colors.bg100,
            paper: colors.bg200,
          },
          text: {
            primary: colors.text100,
            secondary: colors.text200,
          },
          divider: alpha(colors.primary100, 0.2),
        }
      : { // Dark mode palette
          primary: {
            main: colors.primary200,
            light: colors.primary300,
            dark: colors.primary100,
          },
          secondary: {
            main: colors.accent100,
            light: colors.primary300,
          },
          background: {
            default: '#1E1E1E',
            paper: '#2C2C2C',
          },
          text: {
            primary: '#E0E0E0',
            secondary: alpha('#FFFFFF', 0.7),
          },
          divider: alpha('#FFFFFF', 0.12),
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '8px',
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? `${colors.primary300} !important` : `${colors.accent200} !important`,
            color: mode === 'light' ? colors.primary100 : colors.primary200,
            '& .MuiListItemIcon-root': {
              color: colors.primary100,
            },
            '&:hover': {
              backgroundColor: mode === 'light' ? `${alpha(colors.primary300, 0.9)} !important` : `${alpha(colors.accent200, 0.9)} !important`,
            }
          },
          '&:hover': {
            backgroundColor: alpha(mode === 'light' ? colors.primary100 : colors.primary200, 0.08),
          },
        }),
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
            }
        }
    }
  },
});

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isInClub, setIsInClub] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const storedMode = localStorage.getItem('darkMode');
      return storedMode ? JSON.parse(storedMode) : false;
    } catch (error) {
      console.error("Erreur lors de la lecture de darkMode depuis localStorage", error);
      return false;
    }
  });

  const [drawerCollapsed, setDrawerCollapsed] = useState(true);
  const isMobile = useMediaQuery('(max-width: 900px)');

  const theme = useMemo(() => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')), [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de darkMode dans localStorage", error);
    }
  }, [darkMode]);

  const checkIsInClub = async () => {
    try {
      const response = await axiosInstance.get('/api/userIsInClub');
      if (response.status === 200) {
        setIsInClub(response.data.count > 0);
      }
    } catch (error) {
      console.error('La vérification du club a échoué:', error.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/user');
        setUser(response.data);
        await checkIsInClub();
      } catch (err) {
        console.error("La vérification de l'authentification a échoué:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    GetNumberOfNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      await axiosInstance.post('/logout', {}, {
        headers: {
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
        },
      });
      setUser(null);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const toggleDrawerCollapse = () => {
    setDrawerCollapsed(!drawerCollapsed);
  };

  const GetNumberOfNotifications = async() => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/user/notifications/not-read-number');
        console.log('Nombre de notifications:', response.data.count);
        setNotificationsCount(response.data.not_read_number);
      } catch (err) {
        console.error('Erreur de comptage des notifications:', err);
        setNotificationsCount(0);
      } finally {
        setLoading(false);
      }
    };

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (user.user_type !== 'student') {
    switch (user.user_type) {
      case 'club_admin': return <Navigate to="/club-admin/dashboard" replace />;
      case 'system_admin': return <Navigate to="/system-admin/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  const drawerItems = !isInClub
    ? [
        { text: 'Clubs', icon: <SchoolIcon />, link: '/student/clubs' },
        { text: 'Candidatures', icon: <GroupIcon />, link: '/student/applications' },
        { text: 'Événements Publics', icon: <EventIcon />, link: '/student/public-events' },
      ]
    : [
        { text: 'Tableau de Bord', icon: <DashboardIcon />, link: '/student/dashboard' },
        { text: 'Tableau de Bord du Club', icon: <SchoolIcon />, link: '/student/club-dashboard' },
        { text: 'Événements', icon: <EventIcon />, link: '/student/events' },
        { text: 'Membres', icon: <GroupIcon />, link: '/student/members' },
      ];

  const drawerContent = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: theme.palette.background.paper,
      overflow: 'hidden',
    }}>

      <List sx={{ flexGrow: 1, overflowY: 'auto', py: 1, overflowX: 'hidden', mt: isMobile ? 0 : appBarHeight }}>
        {drawerItems.map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ scale: drawerCollapsed ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{color: location.pathname.startsWith(item.link) ?  '#005d2d': 'inherit',}}
          >
            <ListItem
              button
              component={RouterLink}
              to={item.link}
              selected={location.pathname.startsWith(item.link)}
              sx={{
                justifyContent: drawerCollapsed ? 'center' : 'flex-start',
                px: drawerCollapsed ? 0 : 2,
                minHeight: '48px',
              }}
              title={drawerCollapsed ? item.text : ""}
            >
              <ListItemIcon sx={{
                minWidth: drawerCollapsed ? 'auto' : '40px',
                justifyContent: 'center',
                color: 'inherit',
                transition: 'color 0.2s',
                mr: drawerCollapsed ? 0 : 1,
              }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              {!drawerCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10}}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
                >
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname.startsWith(item.link) ? 600 : 400,
                      fontSize: '0.9rem',
                      sx: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                    }}
                  />
                </motion.div>
              )}
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Box sx={{ mt: 'auto', borderTop: `1px solid ${theme.palette.divider}` }}>
        {/* Notifications */}
        <ListItem
          button
          component={RouterLink}
          to="/student/notifications"
          selected={location.pathname.startsWith('/student/notifications')}
          sx={{
            justifyContent: drawerCollapsed ? 'center' : 'flex-start',
            px: drawerCollapsed ? 0 : 2,
            minHeight: '48px',
          }}
            title={drawerCollapsed ? "Notifications" : ""}
        >
          <ListItemIcon sx={{
            minWidth: drawerCollapsed ? 'auto' : '40px',
            justifyContent: 'center',
            color: 'inherit',
            mr: drawerCollapsed ? 0 : 1,
          }}>
            <Badge badgeContent={notificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          {!drawerCollapsed && (
             <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10}}
                transition={{ duration: 0.2, delay: 0.05 }}
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
            >
                <ListItemText
                primary="Notifications"
                primaryTypographyProps={{
                    fontWeight: location.pathname.startsWith('/student/notifications') ? 600 : 400,
                    fontSize: '0.9rem',
                    sx: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}
                }}
                />
            </motion.div>
          )}
        </ListItem>

        {/* Profile */}
        <ListItem
          button
          onClick={handleMenuOpen}
          sx={{
            justifyContent: drawerCollapsed ? 'center' : 'flex-start',
            px: drawerCollapsed ? 0 : 2,
            minHeight: '48px',
          }}
          title={drawerCollapsed ? "Profil" : ""}
        >
          <ListItemIcon sx={{
            minWidth: drawerCollapsed ? 'auto' : '40px',
            justifyContent: 'center',
            mr: drawerCollapsed ? 0 : 1,
            color: 'inherit',
          }}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar
                alt={user?.first_name || 'Utilisateur'}
                src={user?.profile_image || "/static/images/avatar/1.jpg"}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.8rem',
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.getContrastText(theme.palette.primary.main),
                }}
              />
            </StyledBadge>
          </ListItemIcon>
          {!drawerCollapsed && (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10}}
                transition={{ duration: 0.2, delay: 0.05 }}
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
            >
                <ListItemText
                    primary={user?.first_name || "Profil"}
                    primaryTypographyProps={{ fontSize: '0.9rem', sx: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'} }}
                />
            </motion.div>
          )}
        </ListItem>

        {/* Theme toggle */}
        <ListItem
          button
          onClick={toggleDarkMode}
          sx={{
            justifyContent: drawerCollapsed ? 'center' : 'flex-start',
            px: drawerCollapsed ? 0 : 2,
            minHeight: '48px',
          }}
          title={drawerCollapsed ? (darkMode ? 'Mode Clair' : 'Mode Sombre') : ""}
        >
          <ListItemIcon sx={{
            minWidth: drawerCollapsed ? 'auto' : '40px',
            justifyContent: 'center',
            mr: drawerCollapsed ? 0 : 1,
            color: 'inherit',
          }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          {!drawerCollapsed && (
             <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10}}
                transition={{ duration: 0.2, delay: 0.05 }}
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
            >
                <ListItemText
                    primary={darkMode ? 'Mode Clair' : 'Mode Sombre'}
                    primaryTypographyProps={{ fontSize: '0.9rem', sx: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'} }}
                />
            </motion.div>
          )}
        </ListItem>

        {!isMobile && (
          <>
            <Divider />
            <ListItem
              button
              onClick={toggleDrawerCollapse}
              sx={{
                justifyContent: drawerCollapsed ? 'center' : 'flex-start',
                px: drawerCollapsed ? 0 : 2,
                minHeight: '48px',
              }}
              title={drawerCollapsed ? "Étendre" : "Réduire"}
            >
              <ListItemIcon sx={{
                minWidth: drawerCollapsed ? 'auto' : '40px',
                justifyContent: 'center',
                mr: drawerCollapsed ? 0 : 1,
                color: 'inherit',
              }}>
                {drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </ListItemIcon>
              {!drawerCollapsed && (
                  <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10}}
                      transition={{ duration: 0.2, delay: 0.05 }}
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
                  >
                      <ListItemText
                          primary="Réduire"
                          primaryTypographyProps={{ fontSize: '0.9rem', sx: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'} }}
                      />
                  </motion.div>
              )}
            </ListItem>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CssBaseline />

        {/* Mobile-only AppBar */}
        {isMobile && (
          <AppBar
            position="fixed" // Keeps AppBar at the top
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: theme.shadows[2] // Subtle shadow
            }}
          >
            <Toolbar sx={{ minHeight: appBarHeight }}>
              <IconButton
                color="inherit"
                aria-label="ouvrir le tiroir" // French: open drawer
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              {/* You can add a title or other AppBar content here if needed */}
              {/* <Typography variant="h6" noWrap component="div">Titre de l'application</Typography> */}
            </Toolbar>
          </AppBar>
        )}

        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={isMobile ? toggleDrawer : undefined}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: isMobile ? drawerWidth : (drawerCollapsed ? collapsedDrawerWidth : drawerWidth),
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: isMobile ? drawerWidth : (drawerCollapsed ? collapsedDrawerWidth : drawerWidth),
              boxSizing: 'border-box',
              borderRight: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: `calc(100% - ${isMobile ? 0 : (drawerCollapsed ? collapsedDrawerWidth : drawerWidth)}px)`,
            marginLeft: isMobile ? 0 : (drawerCollapsed ? `${collapsedDrawerWidth}px` : `${drawerWidth}px`),
            transition: theme.transitions.create(['width', 'margin-left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowY: 'auto',
            height: '100vh',
            paddingTop: isMobile ? appBarHeight : 0, 
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ height: '100%'}}
            >
              <Box sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                <Outlet />
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              mt: 1.5,
              minWidth: 180,
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <MenuItem
            component={RouterLink}
            to="/student/profile"
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{fontSize: '0.9rem'}}>Profil</ListItemText>
          </MenuItem>
          {/* <MenuItem
            component={RouterLink}
            to="/student/settings" // Example, if you add settings
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{fontSize: '0.9rem'}}>Paramètres</ListItemText>
          </MenuItem> */}
          <Divider sx={{ my: 0.5 }}/>
          <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{color: theme.palette.error.main}}/>
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{fontSize: '0.9rem', color: theme.palette.error.main}}>Déconnexion</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default StudentLayout;
