import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../apiConfig/axios';
import { Avatar, Button, TextField, CircularProgress, Grid, Typography, Box, Divider, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const colors = {
  primary: '#0C9D77',
  primaryLight: '#E6F7F2',
  textDark: '#1E293B',
  textLight: '#64748B',
  borderColor: '#E2E8F0',
  errorColor: '#EF4444',
  backgroundColor: '#FFFFFF',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  gradient: 'linear-gradient(135deg, #0C9D77 0%, #34D399 100%)'
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    profile_image: null,
    profile_image_url: '',
    student_id: '',
    year_of_study: '',
    user_type: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const IMGBB_API_KEY = '8832153b5e9b73e6daaa432dd081e2e9';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120 }
    }
  };

  const loaderVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        await axiosInstance.get('/sanctum/csrf-cookie');
        const response = await axiosInstance.get('/api/profile');
        const user = response.data.user || {};
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone_number: user.phone_number || '',
          bio: user.bio || '',
          profile_image: null,
          profile_image_url: user.profile_image || '',
          student_id: user.student_id || '',
          year_of_study: user.year_of_study || '',
          user_type: user.user_type || '',
        });
        setError(null);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_image' && files[0]) {
      if (files[0].size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(files[0].type)) {
        setError('Only JPEG, PNG or JPG files are allowed');
        return;
      }
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      await axiosInstance.get('/sanctum/csrf-cookie');
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      let imgbbUrl = formData.profile_image_url;
      if (formData.profile_image && formData.profile_image instanceof File) {
        const formDataToImgbb = new FormData();
        formDataToImgbb.append('image', formData.profile_image);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formDataToImgbb,
        });
        const imgbbData = await imgbbResponse.json();

        if (imgbbData.success) {
          imgbbUrl = imgbbData.data.url;
        } else {
          throw new Error('ImgBB upload failed: ' + imgbbData.status_message);
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('profile_image', imgbbUrl);
      formDataToSend.append('student_id', formData.student_id);
      formDataToSend.append('year_of_study', formData.year_of_study);
      formDataToSend.append('user_type', formData.user_type);

      const config = {
        headers: {
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
        },
        withCredentials: true,
      };

      const response = await axiosInstance.patch('/api/profile', formDataToSend, config);
      setMessage('Profile updated successfully!');
      setEditMode(false);

      const updatedUser = response.data.user || {};
      setFormData({
        ...formData,
        first_name: updatedUser.first_name || formData.first_name,
        last_name: updatedUser.last_name || formData.last_name,
        email: updatedUser.email || formData.email,
        phone_number: updatedUser.phone_number || formData.phone_number,
        bio: updatedUser.bio || formData.bio,
        profile_image: null,
        profile_image_url: updatedUser.profile_image || formData.profile_image_url,
        student_id: updatedUser.student_id || formData.student_id,
        year_of_study: updatedUser.year_of_study || formData.year_of_study,
        user_type: updatedUser.user_type || formData.user_type,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      const fieldErrors = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.message;
      setError(fieldErrors ? `${errorMessage}: ${fieldErrors}` : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode='wait'>
      {loading ? (
        <motion.div
          key="loader"
          variants={loaderVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            background: colors.primaryLight
          }}>
            <CircularProgress size={60} thickness={4} sx={{ color: colors.primary }} />
          </Box>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box sx={{ 
            minHeight: '100vh',
            background: colors.primaryLight,
            py: { xs: 0, md: 4 },
            px: { xs: 0, md: 4 }
          }}>
            <Paper elevation={0} sx={{ 
              maxWidth: 1200,
              mx: 'auto',
              borderRadius: { xs: 0, md: 3 },
              overflow: 'hidden',
              boxShadow: { xs: 'none', md: colors.shadow },
              bgcolor: colors.backgroundColor
            }}>
              {/* Header */}
              <Box sx={{ 
                background: colors.gradient,
                color: 'white',
                py: 3,
                px: { xs: 2, md: 4 },
                textAlign: 'center'
              }}>
                <motion.div variants={itemVariants}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 600,
                    letterSpacing: 1 
                  }}>
                    User Profile
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Manage your personal information
                  </Typography>
                </motion.div>
              </Box>

              <Grid container>
                {/* Profile Sidebar */}
                <Grid item xs={12} md={4} sx={{ 
                  bgcolor: colors.backgroundColor,
                  borderRight: { md: `1px solid ${colors.borderColor}` },
                  p: { xs: 2, md: 3 }
                }}>
                  <motion.div variants={itemVariants}>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Box sx={{ 
                        position: 'relative',
                        mb: 2,
                        borderRadius: '50%',
                        p: 1,
                        border: `2px solid ${colors.borderColor}`
                      }}>
                        <Avatar
                          src={formData.profile_image_url || 'https://via.placeholder.com/150'}
                          alt="Profile"
                          sx={{ 
                            width: 150, 
                            height: 150,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }}
                        />
                        {editMode && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<CloudUploadIcon />}
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                minWidth: 'auto',
                                p: 1,
                                bgcolor: colors.primary,
                                '&:hover': { bgcolor: '#0a8566' }
                              }}
                            >
                              <input
                                type="file"
                                name="profile_image"
                                accept="image/jpeg,image/png,image/jpg"
                                hidden
                                onChange={handleChange}
                                ref={fileInputRef}
                              />
                            </Button>
                          </motion.div>
                        )}
                      </Box>
                      
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        textAlign: 'center',
                        mb: 0.5,
                        color: colors.textDark
                      }}>
                        {formData.first_name} {formData.last_name}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ 
                        color: colors.textLight,
                        textAlign: 'center',
                        mb: 2
                      }}>
                        {formData.user_type ? formData.user_type.replace('_', ' ').toUpperCase() : 'No role specified'}
                      </Typography>
                      
                      {!editMode ? (
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setEditMode(true)}
                            sx={{
                              borderRadius: 20,
                              px: 3,
                              textTransform: 'none',
                              borderColor: colors.primary,
                              color: colors.primary,
                              '&:hover': {
                                bgcolor: colors.primary,
                                color: 'white',
                                borderColor: colors.primary
                              }
                            }}
                          >
                            Edit Profile
                          </Button>
                        </motion.div>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button
                              variant="contained"
                              startIcon={<SaveIcon />}
                              onClick={handleSubmit}
                              disabled={loading}
                              sx={{
                                borderRadius: 20,
                                px: 3,
                                textTransform: 'none',
                                bgcolor: colors.primary,
                                '&:hover': { bgcolor: '#0a8566' }
                              }}
                            >
                              {loading ? 'Saving...' : 'Save'}
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button
                              variant="outlined"
                              startIcon={<CancelIcon />}
                              onClick={() => setEditMode(false)}
                              sx={{
                                borderRadius: 20,
                                px: 3,
                                textTransform: 'none',
                                borderColor: colors.errorColor,
                                color: colors.errorColor,
                                '&:hover': {
                                  bgcolor: colors.errorColor,
                                  color: 'white'
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          </motion.div>
                        </Box>
                      )}
                    </Box>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Divider sx={{ my: 2, borderColor: colors.borderColor }} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 600,
                        color: colors.textLight,
                        mb: 1
                      }}>
                        CONTACT INFORMATION
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textDark }}>Email</Typography>
                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                          {formData.email || 'Not provided'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textDark }}>Phone</Typography>
                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                          {formData.phone_number || 'Not provided'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textDark }}>Student ID</Typography>
                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                          {formData.student_id || 'Not provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Divider sx={{ my: 2, borderColor: colors.borderColor }} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 600,
                        color: colors.textLight,
                        mb: 1
                      }}>
                        ACADEMIC INFORMATION
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textDark }}>Year of Study</Typography>
                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                          {formData.year_of_study || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={8} sx={{ bgcolor: colors.primaryLight, p: { xs: 2, md: 4 } }}>
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ 
                          bgcolor: '#FEE2E2',
                          borderLeft: `4px solid ${colors.errorColor}`,
                          p: 2,
                          mb: 3,
                          borderRadius: 1
                        }}>
                          <Typography variant="body2" sx={{ color: colors.errorColor }}>{error}</Typography>
                        </Box>
                      </motion.div>
                    )}
                    
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ 
                          bgcolor: '#D1FAE5',
                          borderLeft: `4px solid ${colors.primary}`,
                          p: 2,
                          mb: 3,
                          borderRadius: 1
                        }}>
                          <Typography variant="body2" sx={{ color: colors.primary }}>{message}</Typography>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={containerVariants}>
                    <Box sx={{ mb: 4 }}>
                      <motion.div variants={itemVariants}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: colors.primary,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          Personal Information
                        </Typography>
                      </motion.div>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Enter your first name"
                              disabled={!editMode}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: editMode ? 'white' : 'action.disabledBackground'
                                }
                              }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Enter your last name"
                              disabled={!editMode}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: editMode ? 'white' : 'action.disabledBackground'
                                }
                              }}
                            />
                          </motion.div>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <motion.div variants={itemVariants}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: colors.primary,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          Contact Details
                        </Typography>
                      </motion.div>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Enter your email"
                              type="email"
                              disabled={!editMode}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: editMode ? 'white' : 'action.disabledBackground'
                                }
                              }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="+212123456789"
                              type="tel"
                              disabled={!editMode}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: editMode ? 'white' : 'action.disabledBackground'
                                }
                              }}
                            />
                          </motion.div>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <motion.div variants={itemVariants}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: colors.primary,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          Academic Information
                        </Typography>
                      </motion.div>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Student ID"
                              name="student_id"
                              value={formData.student_id}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Enter your student ID"
                              disabled={!editMode}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: editMode ? 'white' : 'action.disabledBackground'
                                }
                              }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Year of Study"
                              name="year_of_study"
                              value={formData.year_of_study}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Enter your year of study"
                              type="number"
                              inputProps={{ min: 1, max: 10 }}
                              disabled={!editMode}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: editMode ? 'white' : 'action.disabledBackground'
                                }
                              }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              select
                              label="User Type"
                              name="user_type"
                              value={formData.user_type}
                              onChange={handleChange}
                              variant="outlined"
                              SelectProps={{ native: true }}
                              disabled={!editMode}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: editMode ? 'white' : 'action.disabledBackground'
                                }
                              }}
                            >
                              <option value="">Select user type</option>
                              <option value="student">Student</option>
                              <option value="club_admin">Club Admin</option>
                              <option value="system_admin">System Admin</option>
                            </TextField>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box>
                      <motion.div variants={itemVariants}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: colors.primary,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          About Me
                        </Typography>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          variant="outlined"
                          placeholder="Tell us about yourself"
                          multiline
                          rows={4}
                          disabled={!editMode}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: editMode ? 'white' : 'action.disabledBackground'
                            }
                          }}
                        />
                      </motion.div>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Profile;