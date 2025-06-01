import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../apiConfig/axios'; // Assuming this path is correct
import {
  Container, TextField, Typography, Button, Grid, Box, Alert, CircularProgress, Avatar, Paper,
  IconButton, Tooltip, Tabs, Tab, useTheme, useMediaQuery,
  Card, CardContent, CardActions, CardMedia, Chip
} from '@mui/material';
import {
  Edit as EditIcon, PhotoCamera as PhotoCameraIcon, Save as SaveIcon,
  PersonOutline as PersonOutlineIcon, School as SchoolIcon, InfoOutlined as InfoOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon, PhoneOutlined as PhoneOutlinedIcon, BadgeOutlined as BadgeOutlinedIcon,
  WorkOutline as WorkOutlineIcon, CalendarTodayOutlined as CalendarTodayOutlinedIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Define your color palette (can be imported from a shared theme file)
const colors = {
  primary100: '#2e8b57', // Sea Green
  primary200: '#61bc84', // Lighter Sea Green
  primary300: '#c6ffe6', // Very Light Mint Green
  accent100: '#61bc84',
  accent200: '#005d2d',
  text100: '#000000',
  text200: '#2c2c2c',
  bg100: '#effff6',
  bg200: '#e5f5ec',
  bg300: '#bcccc3',
  white: '#FFFFFF',
  grey50: '#f9fafb',
  grey100: '#f3f4f6',
  grey200: '#e5e7eb',
  grey300: '#d1d5db',
  grey700: '#374151',
};

const ModernProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    profile_image: null,
    profile_image_url: '',
    student_id: '',
    major: '',
    year_of_study: '',
    user_type: '', // Should not be editable by student, usually
  });
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/profile');
      const user = response.data.user;
      const fetchedData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        bio: user.bio || '',
        profile_image: null, // Will be handled separately
        profile_image_url: user.profile_image || '',
        student_id: user.student_id || '',
        major: user.major || '',
        year_of_study: user.year_of_study || '',
        user_type: user.user_type || '',
      };
      setFormData(fetchedData);
      setInitialData(fetchedData); // Store initial data for comparison or reset
      setImagePreview(fetchedData.profile_image_url);
    } catch (err) {
      setError('Failed to load profile data. Please try again or contact support.');
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setMessage('');

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const dataToSend = new FormData();
      // Only append fields that have changed or the image if it's new
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'profile_image_url') return; // Don't send the old URL
        if (key === 'profile_image' && value) { // If there's a new image file
          dataToSend.append(key, value);
        } else if (key !== 'profile_image' && value !== initialData[key]) { // For other fields, if changed
          dataToSend.append(key, value);
        }
      });
      
      // If no actual data changed other than potentially clearing the image (which is not typical for PATCH)
      // and no new image was selected, we might not need to send.
      // However, backend should handle empty FormData gracefully or this logic needs refinement.
      // For simplicity, we'll send if FormData has any entries.
      // A specific check for `profile_image` is important.
      if (!dataToSend.has('profile_image') && Array.from(dataToSend.keys()).length === 0) {
          setMessage("No changes to update.");
          setUpdating(false);
          setEditMode(false);
          return;
      }


      const response = await axiosInstance.patch('/api/profile', dataToSend, {
        headers: {
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
          'Content-Type': 'multipart/form-data', // Essential for file uploads
        },
      });

      setMessage('Profile updated successfully!');
      const updatedUser = response.data.user || {};
      const newFetchedData = {
        first_name: updatedUser.first_name || '',
        last_name: updatedUser.last_name || '',
        email: updatedUser.email || '',
        phone_number: updatedUser.phone_number || '',
        bio: updatedUser.bio || '',
        profile_image: null,
        profile_image_url: updatedUser.profile_image || formData.profile_image_url, // Keep current if not updated
        student_id: updatedUser.student_id || '',
        major: updatedUser.major || '',
        year_of_study: updatedUser.year_of_study || '',
        user_type: updatedUser.user_type || '',
      };
      setFormData(newFetchedData);
      setInitialData(newFetchedData); // Update initial data to new state
      if (updatedUser.profile_image) { // If backend returns new image URL
        setImagePreview(updatedUser.profile_image);
      }
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed. Please check your input.');
      console.error("Update profile error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const ProfileInfoItem = ({ icon, label, value }) => (
    <Box display="flex" alignItems="center" mb={1.5}>
      <Box component={motion.div} whileHover={{ scale: 1.1 }} color="primary.main" mr={1.5}>
        {icon}
      </Box>
      <Typography variant="body1" color="text.secondary">
        <strong style={{ color: theme.palette.text.primary }}>{label}:</strong> {value || <em style={{color: colors.grey300}}>Not provided</em>}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: theme.palette.mode === 'dark' ? colors.grey700 : colors.grey50, borderRadius: 2, mt: 2 }}>
      <motion.div initial="hidden" animate="visible" variants={{visible: {transition: {staggerChildren: 0.2}}}}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          My Profile
        </Typography>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
            </motion.div>
          )}
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Grid container spacing={isMobile ? 2 : 4}>
          {/* Profile Display Section */}
          <Grid item xs={12} md={5}>
            <motion.div variants={cardVariants}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', background: theme.palette.background.paper }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                  <motion.div whileHover={{ scale: 1.05 }} style={{ position: 'relative' }}>
                    <Avatar
                      src={imagePreview || formData.profile_image_url}
                      alt={`${formData.first_name} ${formData.last_name}`}
                      sx={{ 
                        width: isMobile ? 100 : 150, 
                        height: isMobile ? 100 : 150, 
                        mb: 2, 
                        border: `4px solid ${theme.palette.primary.main}`,
                        fontSize: '4rem'
                      }}
                    >
                      {(!imagePreview && !formData.profile_image_url) && `${formData.first_name?.charAt(0)}${formData.last_name?.charAt(0)}`}
                    </Avatar>
                    {editMode && (
                      <IconButton
                        component="label"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 10,
                          right: 10,
                          backgroundColor: alpha(theme.palette.primary.main, 0.8),
                          color: colors.white,
                          '&:hover': { backgroundColor: theme.palette.primary.dark },
                        }}
                      >
                        <PhotoCameraIcon fontSize="small"/>
                        <input type="file" hidden accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} />
                      </IconButton>
                    )}
                  </motion.div>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: '600', color: 'primary.dark' }}>
                    {formData.first_name} {formData.last_name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {formData.email}
                  </Typography>
                  <Chip label={formData.user_type.replace('_', ' ').toUpperCase()} color="primary" size="small" variant="outlined" />
                </Box>

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main', mt: 2, borderBottom: `1px solid ${theme.palette.divider}`, pb:1 }}>
                  About Me
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', minHeight: '60px', whiteSpace: 'pre-wrap' }}>
                  {formData.bio || <em style={{color: colors.grey300}}>No bio provided. Click 'Edit Profile' to add one.</em>}
                </Typography>

                <Box mt={3}>
                  <ProfileInfoItem icon={<EmailOutlinedIcon />} label="Email" value={formData.email} />
                  <ProfileInfoItem icon={<PhoneOutlinedIcon />} label="Phone" value={formData.phone_number} />
                  <ProfileInfoItem icon={<BadgeOutlinedIcon />} label="Student ID" value={formData.student_id} />
                  <ProfileInfoItem icon={<WorkOutlineIcon />} label="Major" value={formData.major} />
                  <ProfileInfoItem icon={<CalendarTodayOutlinedIcon />} label="Year" value={formData.year_of_study} />
                </Box>
                
                {!editMode && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setEditMode(true);
                        setSelectedTab(0); // Reset to first tab on edit
                        // Ensure form data is current if there were unsaved changes from a previous edit attempt
                        setFormData(initialData); 
                        setImagePreview(initialData.profile_image_url);
                      }}
                      sx={{ mt: 3, borderRadius: '8px', py: 1.2 }}
                    >
                      Edit Profile
                    </Button>
                  </motion.div>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Profile Edit Section */}
          <AnimatePresence>
          {editMode && (
            <Grid item xs={12} md={7}>
              <motion.div variants={formVariants} initial="hidden" animate="visible" exit={{opacity: 0, x: 20}}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', background: theme.palette.background.paper }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.dark', mb: 1}}>
                    Update Your Information
                  </Typography>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={selectedTab} onChange={handleTabChange} aria-label="profile update tabs" variant="fullWidth">
                      <Tab label="Personal" icon={<PersonOutlineIcon />} iconPosition="start" />
                      <Tab label="Academic" icon={<SchoolIcon />} iconPosition="start" />
                      <Tab label="Bio" icon={<InfoOutlinedIcon />} iconPosition="start" />
                    </Tabs>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    {selectedTab === 0 && ( // Personal Info
                      <motion.div key="personal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} variant="outlined" />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} variant="outlined" />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} variant="outlined" />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} variant="outlined" />
                          </Grid>
                        </Grid>
                      </motion.div>
                    )}
                    {selectedTab === 1 && ( // Academic Info
                      <motion.div key="academic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Student ID" name="student_id" value={formData.student_id} onChange={handleChange} variant="outlined" />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Major" name="major" value={formData.major} onChange={handleChange} variant="outlined" />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Year of Study" name="year_of_study" type="number" value={formData.year_of_study} onChange={handleChange} variant="outlined" inputProps={{ min: 1, max: 10 }} />
                          </Grid>
                        </Grid>
                      </motion.div>
                    )}
                    {selectedTab === 2 && ( // Bio
                      <motion.div key="bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <TextField
                          fullWidth
                          label="Bio / About Me"
                          name="bio"
                          multiline
                          rows={5}
                          value={formData.bio}
                          onChange={handleChange}
                          variant="outlined"
                          placeholder="Tell us a bit about yourself..."
                        />
                      </motion.div>
                    )}
                    <CardActions sx={{ justifyContent: 'flex-end', mt: 3, p:0 }}>
                      <Button 
                        onClick={() => {
                          setEditMode(false); 
                          setFormData(initialData); // Reset changes
                          setImagePreview(initialData.profile_image_url);
                          setError(null);
                        }} 
                        color="inherit"
                        sx={{ mr: 1 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={updating}
                        startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        sx={{ borderRadius: '8px', py: 1.2 }}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardActions>
                  </form>
                </Paper>
              </motion.div>
            </Grid>
          )}
          </AnimatePresence>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default ModernProfilePage;
