import React, { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, useMediaQuery, Avatar, Menu, MenuItem, Divider, Badge, Tooltip, Paper,
  Stack, useTheme, styled, alpha
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
  Settings as SettingsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../apiConfig/axios';
import LoadingScreen from '../components/ui/LoadingScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 230;
const collapsedDrawerWidth = 60;

// Color definitions from your palette
const colors = {
  primary100: '#2e8b57',
  primary200: '#61bc84',
  primary300: '#c6ffe6',
  accent100: '#61bc84',
  accent200: '#005d2d',
  text100: '#000000',
  text200: '#2c2c2c',
  bg100: '#effff6',
  bg200: '#e5f5ec',
  bg300: '#bcccc3',
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
          // Light mode palette
          primary: {
            main: colors.primary100,
            light: colors.primary300,
            dark: colors.accent200,
          },
          secondary: {
            main: colors.primary200,
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
          divider: colors.bg300,
        }
      : {
          // Dark mode palette
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
            default: '#121212',
            paper: '#1E1E1E',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        }),
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          marginTop: '8px',
          minWidth: '200px',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary200, 0.16),
          },
          '&.Mui-selected:hover': {
            backgroundColor: alpha(colors.primary200, 0.24),
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: `${colors.primary100} !important`,
            color: 'white',
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&:hover': {
            backgroundColor: alpha(colors.primary100, 0.08),
          },
        },
      },
    },
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
  const [notifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  // Create theme based on dark mode
  const theme = createTheme(getDesignTokens(darkMode ? 'dark' : 'light'));

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

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleDrawerCollapse = () => {
    setDrawerCollapsed(!drawerCollapsed);
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

  const drawerItems = !isInClub
    ? [
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/student/dashboard' },
        { text: 'Clubs', icon: <SchoolIcon />, link: '/student/clubs' },
        { text: 'Applications', icon: <GroupIcon />, link: '/student/applications' },
        { text: 'Public Events', icon: <EventIcon />, link: '/student/public-events' },
        { text: 'Profile', icon: <PersonIcon />, link: '/student/profile' },
        { text: 'Notifications', icon: <NotificationsIcon />, link: '/student/notifications', badge: notifications },
      ]
    : [
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/student/dashboard' },
        { text: 'Club Dashboard', icon: <SchoolIcon />, link: '/student/club-dashboard' },
        { text: 'Events', icon: <EventIcon />, link: '/student/events' },
        { text: 'Members', icon: <GroupIcon />, link: '/student/members' },
        { text: 'Profile', icon: <PersonIcon />, link: '/student/profile' },
        { text: 'Notifications', icon: <NotificationsIcon />, link: '/student/notifications', badge: notifications },
      ];

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: theme.palette.background.paper,
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: drawerCollapsed ? 'center' : 'space-between',
        minHeight: '64px',
        px: 2,
      }}>
        {!drawerCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" noWrap>
              Student Portal
            </Typography>
          </motion.div>
        )}
        <IconButton onClick={toggleDrawerCollapse}>
          {drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      
      <Divider />
      
      <List sx={{ flexGrow: 1, overflowY: 'auto', py: 1,overflowX: 'hidden' }}>
        {drawerItems.map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
            >
              <ListItemIcon sx={{ 
                minWidth: drawerCollapsed ? 'auto' : '56px',
                justifyContent: 'center',
                color: location.pathname.startsWith(item.link) ? '#2E8B57' : 'inherit',
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: location.pathname.startsWith(item.link) ? '600' : '400'
                    }}
                  />
                </motion.div>
              )}
            </ListItem>
          </motion.div>
        ))}
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Stack direction={drawerCollapsed ? 'column' : 'row'} spacing={1} alignItems="center">
          <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleDarkMode} size="small">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          {!drawerCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Typography variant="caption">
                {darkMode ? 'Light mode' : 'Dark mode'}
              </Typography>
            </motion.div>
          )}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CssBaseline />
        <AppBar 
          position="fixed"
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            background: `linear-gradient(135deg, ${colors.primary100} 0%, ${'#575352'} 100%)`,
            boxShadow: 'none',
            width: isMobile ? '100%' : `calc(100% - ${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {location.pathname.split('/')[2]?.replace(/-/g, ' ') || 'Dashboard'}
            </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Badge badgeContent={notifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton onClick={handleMenuOpen}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                  >
                    <Avatar
                      alt={user.first_name}
                      src={user.profile_image}
                      sx={{
                        bgcolor: colors.primary300,
                        color: colors.primary100,
                        width: 40,
                        height: 40,
                      }}
                    />
                  </StyledBadge>
                </IconButton>
              </motion.div>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* User Menu */}
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
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem
            component={RouterLink}
            to="/student/settings"
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Sidebar Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerCollapsed ? collapsedDrawerWidth : drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerCollapsed ? collapsedDrawerWidth : drawerWidth,
                boxSizing: 'border-box',
                borderRight: 'none',
                boxShadow: theme.shadows[1],
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // p: 3,
            width: isMobile ? '100%' : `calc(100% - ${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  // borderRadius: 4,
                  // p: 3,
                  minHeight: 'calc(100vh - 96px)',
                  background: theme.palette.background.paper,
                }}
              >
                <Outlet />
              </Paper>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudentLayout;