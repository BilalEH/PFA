import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../apiConfig/axios';
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
const Profile = () => {
  const navigate = useNavigate();
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
    user_type: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/profile');
        const user = response.data.user;
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone_number: user.phone_number || '',
          bio: user.bio || '',
          profile_image: null,
          profile_image_url: user.profile_image || '',
          student_id: user.student_id || '',
          major: user.major || '',
          year_of_study: user.year_of_study || '',
          user_type: user.user_type || '',
        });
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
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
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'profile_image_url') return;
        if (key === 'profile_image' && value === null) return;
        formDataToSend.append(key, value);
      });

      const response = await axiosInstance.patch('/api/profile', formDataToSend, {
        headers: {
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Profile updated successfully!');

      const updatedUser = response.data.user || {};
      setFormData({
        first_name: updatedUser.first_name || '',
        last_name: updatedUser.last_name || '',
        email: updatedUser.email || '',
        phone_number: updatedUser.phone_number || '',
        bio: updatedUser.bio || '',
        profile_image: null,
        profile_image_url: updatedUser.profile_image || '',
        student_id: updatedUser.student_id || '',
        major: updatedUser.major || '',
        year_of_study: updatedUser.year_of_study || '',
        user_type: updatedUser.user_type || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center">Update Your Profile</Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Manage your personal information below
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} display="flex" alignItems="center" gap={2}>
            {formData.profile_image_url && (
              <Avatar src={formData.profile_image_url} alt="Profile Image" sx={{ width: 56, height: 56 }} />
            )}
            <Button variant="contained" component="label">
              Upload Profile Image
              <input
                type="file"
                name="profile_image"
                accept="image/jpeg,image/png,image/jpg"
                hidden
                onChange={handleChange}
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student ID"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Major"
              name="major"
              value={formData.major}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Year of Study"
              name="year_of_study"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={formData.year_of_study}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="User Type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
            >
              <MenuItem value="">Select user type</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="club_admin">Club Admin</MenuItem>
              <MenuItem value="system_admin">System Admin</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Profile;