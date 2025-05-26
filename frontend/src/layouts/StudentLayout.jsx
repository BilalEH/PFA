import React, { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, CssBaseline, Box, useMediaQuery,
  Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../apiConfig/axios';
import LoadingScreen from '../components/ui/LoadingScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#0C9D77',
      light: '#E6F7F2',
    },
    background: {
      default: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    error: {
      main: '#EF4444',
    },
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#1E293B',
          '&:hover': {
            background: 'linear-gradient(135deg, #0C9D77 0%, #34D399 100%)',
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});

const StudentLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isInClub, setIsInClub] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const checkIsInClub = async () => {
    try {
      const response = await axiosInstance.get('/api/userIsInClub');
      if (response.status === 200) {
        setIsInClub(response.data.count > 0);
      }
    } catch (error) {
      console.error('Club check failed:', error.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        setUser(response.data);
        await checkIsInClub();
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
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
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.user_type !== 'student') {
    switch (user.user_type) {
      case 'club_admin':
        return <Navigate to="/club-admin/dashboard" replace />;
      case 'system_admin':
        return <Navigate to="/system-admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  const drawerItems = isInClub
    ? [
        { text: 'Clubs', link: '/student/clubs' },
        { text: 'Mes candidatures', link: '/student/applications' },
        { text: 'Profil', link: '/student/profile' },
      ]
    : [
        { text: 'Dashboard', link: '/student/dashboard' },
        { text: 'Événements', link: '/student/events' },
        { text: 'Clubs', link: '/student/clubs' },
        { text: 'Profil', link: '/student/profile' },
      ];

  const drawer = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Toolbar />
      <List>
        {drawerItems.map(item => (
          <ListItem
            button
            component={RouterLink}
            to={item.link}
            key={item.text}
            sx={{
              '&:hover': {
                background: 'linear-gradient(135deg, #0C9D77 0%, #34D399 100%)',
                '& .MuiListItemText-primary': {
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isMobile && (
          <ListItem button onClick={handleLogout}>
            <LogoutIcon sx={{ marginRight: 1, color: '#1E293B' }} />
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Portail Étudiant
            </Typography>
            {!isMobile && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton onClick={handleMenuOpen}>
                  <Avatar
                    alt={user.first_name}
                    src={user.profile_image}
                    sx={{
                      bgcolor: '#E6F7F2',
                      color: '#0C9D77',
                      width: 40,
                      height: 40,
                    }}
                  >
                  </Avatar>
                </IconButton>
              </motion.div>
            )}
          </Toolbar>
        </AppBar>

        <AnimatePresence>
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  component={RouterLink}
                  to="/student/profile"
                  onClick={handleMenuClose}
                >
                  Profil
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                  <LogoutIcon sx={{ marginRight: 1, color: '#1E293B' }} />
                  Logout
                </MenuItem>
              </Menu>
            </motion.div>
          )}
        </AnimatePresence>

        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                background: '#FFFFFF',
                borderRight: '1px solid #E2E8F0',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                background: '#FFFFFF',
                borderRight: '1px solid #E2E8F0',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // p: 3,
            backgroundColor: 'background.default',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudentLayout;